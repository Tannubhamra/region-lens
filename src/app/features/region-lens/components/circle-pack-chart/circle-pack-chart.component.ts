import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';
import { ITransformedData, IChartNode } from '../../interfaces/pack-chart.interface';
import { DrawerService } from '../../../../shared/services/drawer.service';
import { ChartColor } from '../../enums';

@Component({
  selector: 'app-circle-pack-chart',
  imports: [CommonModule],
  templateUrl: './circle-pack-chart.component.html',
  styleUrl: './circle-pack-chart.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePackChartComponent implements AfterViewInit, OnChanges, OnDestroy{
  @Input() transformedChartData!: ITransformedData;
  @ViewChild('tooltip', {static: true}) tooltipRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chartContainer', { static: true }) chartContainerRef!: ElementRef;
  
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private zoomScale = 1;
  private chartGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private zoomBehavior!: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private currentTransform = d3.zoomIdentity;

  drawerService = inject(DrawerService);

  legendsVisibleDepths = new Map<number, boolean>([
    [0, true],  // World
    [1, true],  // Region
    [2, true],  // SubRegion
    [3, true],  // Country
  ]);

  legendItems = [
    { label: 'World', color: ChartColor.WORLD, depth: 0 },
    { label: 'Region', color: ChartColor.REGION, depth: 1 },
    { label: 'SubRegion', color: ChartColor.SUB_REGION, depth: 2 },
    { label: 'Country', color: ChartColor.COUNTRY, depth: 3 }
  ];
  
  ngAfterViewInit() {
    this.createSvg();
    this.drawChart();
    window.addEventListener('resize', this.onResize);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transformedChartData'] && this.svg || this.chartGroup) {
      this.drawChart();
    }
  }
  
  private createSvg(): void {
    const container = this.chartContainerRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight || width;
  
    d3.select(container).selectAll('*').remove();
  
    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  
   // Chart group where all visuals go (zoom target)
    this.chartGroup = this.svg.append('g');

    // Define zoom behavior: disable scroll wheel, enable drag
    this.zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 5])
    .filter((event) => {
      // Allow only drag and programmatic zoom — disable scroll wheel
      return event.type === 'mousedown' || event.type === 'touchstart';
    })
    .on('zoom', (event) => {
      this.currentTransform = event.transform;
      this.chartGroup.attr('transform', this.currentTransform.toString());
    });

    // Apply zoom behavior
    this.svg.call(this.zoomBehavior);
  }

  drawChart(){
    if (!this.svg || !this.transformedChartData || !this.transformedChartData.children) return;

    const tooltip = d3.select(this.tooltipRef.nativeElement);
    const container = this.chartContainerRef.nativeElement;
    
    const width = container.clientWidth;
    const height = container.clientHeight || width;

    const root = this.createHierarchy(this.transformedChartData);
    const data = this.createPackedLayout(root, width, height);

    this.clearChart();

    const filteredDescendants = this.filterVisibleNodes(data);
    const nodes = this.renderNodes(filteredDescendants);
 
    this.renderCircles(nodes);
    this.renderLabels(nodes);
    this.addInteractions(nodes, tooltip);
  }
  
  private createHierarchy(data: ITransformedData): d3.HierarchyNode<ITransformedData> {
    return d3.hierarchy(data)
    .sum((d) => 'result' in d && typeof d.result === 'number' ? d.result : 1)
    .sort((a, b) => b.value! - a.value!);
  }

  private createPackedLayout(
    root: d3.HierarchyNode<ITransformedData>,
    width: number,
    height: number
  ): d3.HierarchyCircularNode<ITransformedData> {
    const pack = d3.pack<ITransformedData>()
      .size([width, height])
      .padding(4);
  
    return pack(root);
  }

  private clearChart(): void {
    this.chartGroup.selectAll('*').remove();
  }

  private filterVisibleNodes(data: d3.HierarchyCircularNode<ITransformedData>): d3.HierarchyCircularNode<ITransformedData>[] {
    return data.descendants().filter((d) => this.legendsVisibleDepths.get(d.depth) !== false);
  }

  private renderNodes(
    nodes: d3.HierarchyCircularNode<ITransformedData>[]
  ): d3.Selection<SVGGElement, d3.HierarchyCircularNode<ITransformedData>, SVGGElement, unknown> {
    return this.chartGroup
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  private renderCircles(
    nodes: d3.Selection<SVGGElement, d3.HierarchyCircularNode<ITransformedData>, SVGGElement, unknown>
  ): void {
    nodes
      .append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', (d) => this.getColorByDepth(d.depth))
      .attr('stroke', '#333')
      .on('click', (_event, d) => {
        if (d.depth === 0) return;
        this.showCountryDetails(d.data);
      });
  }

  private renderLabels(
    nodes: d3.Selection<SVGGElement, d3.HierarchyCircularNode<ITransformedData>, SVGGElement, unknown>
  ): void {
    nodes
      .filter((d) => d.depth === 3 || d.depth === 0)
      .append('text')
      .text((d) => d.data.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '.2em')
      .style('fill', 'white')
      .style('pointer-events', 'none')
      .style('font-size', '10px');
  }

  private addInteractions(
    nodes: d3.Selection<SVGGElement, d3.HierarchyCircularNode<ITransformedData>, SVGGElement, unknown>,
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>
  ): void {
    nodes
      .on('mouseover', (_: MouseEvent, d: IChartNode) => {
        tooltip
          .classed('hidden', false)
          .html(`<strong>${d.data.name}</strong>`);
      })
      .on('mousemove', (event: MouseEvent) => {
        tooltip
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY}px`);
      })
      .on('mouseout', () => {
        tooltip.classed('hidden', true);
      });
  }

  toggleLegendsDepthVisibility(depth: number): void {
    const current = this.legendsVisibleDepths.get(depth) ?? true;
    this.legendsVisibleDepths.set(depth, !current);
    this.drawChart();
  }

  showCountryDetails(data: ITransformedData) {
    if ( data.children) return; // stop click on region
    this.drawerService.openDrawer('Country Info', data);
  }
 
  private getColorByDepth(depth: number): string {
    const colors = [ChartColor.WORLD, ChartColor.REGION, ChartColor.SUB_REGION, ChartColor.COUNTRY];
    return colors[depth] || ChartColor.DEFAULT;
  }

  resetZoom(): void {
    const svgElement = this.svg.node() as SVGSVGElement;
  
    // Reset zoom transform to identity (no zoom, no pan)
    d3.select(svgElement)
      .transition()
      .duration(300)
      .call(this.zoomBehavior.transform, d3.zoomIdentity);
  
    // Update internal state
    this.zoomScale = 1;
    this.currentTransform = d3.zoomIdentity;
  }

  zoomIn(): void {
    this.zoomScale *= 1.2;
    this.applyZoom();
  }

  zoomOut(): void {
    this.zoomScale /= 1.2;
    this.applyZoom();
  }

  private applyZoom(): void {
    const svgElement = this.svg.node() as SVGSVGElement;

    // Compose new transform by scaling current transform
    const newTransform = this.currentTransform.scale(this.zoomScale / this.currentTransform.k);
  
    // Apply transform using D3 zoom behavior
    d3.select(svgElement)
      .transition()
      .duration(300)
      .call(this.zoomBehavior.transform, newTransform);
  }

  // for responsive charts
  private onResize = () => {
    this.createSvg();
    this.drawChart();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}

