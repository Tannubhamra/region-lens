import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';
import { ITransformedData } from '../../interfaces/pack-chart.interface';
import { DrawerService } from '../../../../shared/services/drawer.service';
import { ICountry } from '../../interfaces/region.interface';

@Component({
  selector: 'app-circle-pack-chart',
  imports: [CommonModule],
  templateUrl: './circle-pack-chart.component.html',
  styleUrl: './circle-pack-chart.component.scss',
  standalone: true
})
export class CirclePackChartComponent implements AfterViewInit, OnChanges, OnDestroy{
  @Input() transformedChartData!: ITransformedData;
  @ViewChild('tooltip', {static: true}) tooltipRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chartContainer', { static: true }) chartContainerRef!: ElementRef;
  
  private svg: any;
  private zoomScale: number = 1;
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
    { label: 'World', color: '#cccccc', depth: 0 },
    { label: 'Region', color: '#a0c4ff', depth: 1 },
    { label: 'SubRegion', color: '#2f4b7c', depth: 2 },
    { label: 'Country', color: '#3a86ff', depth: 3 }
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

    const root = d3
    .hierarchy(this.transformedChartData as any)
    .sum((d: any) => d.result || 1)  // .result is for toggle population/area
    .sort((a, b) => b.value! - a.value!); 

    const pack = d3.pack()
          .size([width, height])
          .padding(4);
    const data = pack(root);

   this.chartGroup.selectAll('*').remove();

   const filteredDescendants = data
  .descendants()
  .filter((d: any) => this.legendsVisibleDepths.get(d.depth) !== false);

   const node = this.chartGroup
   .selectAll('g')
   .data(filteredDescendants)
   .enter()
   .append('g')
   .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

   node
   .append('circle')
   .attr('r', (d: any) => d.r)
   .attr('fill', (d: any) => this.getColorByDepth(d.depth))
   .attr('stroke', '#333')
   .on('click', (_event: any, d: any) => {
    if (d.depth === 0) return; 
    this.showCountryDetails(d.data)
   });

    // country Labels
    node
      .filter((d: any) => d.depth === 3 || d.depth === 0)
      .append('text')
      .text((d: any) => d.data.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '.2em')
      .style('fill', 'white')
      .style('pointer-events', 'none')
      .style('font-size', '10px');


    node.on('mouseover', (event:MouseEvent, d: any) => {
    const data = d.data;

    tooltip
      .classed('hidden', false)
      .html(`
        <strong>${data.name}</strong>
      `);
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

  toggleDepthVisibility(depth: number): void {
    const current = this.legendsVisibleDepths.get(depth) ?? true;
    this.legendsVisibleDepths.set(depth, !current);
    this.drawChart();
  }

  private showCountryDetails(data: any) {

    if ( data.children) return; // stop click on region
    this.drawerService.openDrawer('Country Info', data);
  }
 
  private getColorByDepth(depth: number): string {
    const colors = ['#cccccc', '#a0c4ff', '#2f4b7c','#3a86ff'];
                     // world , region, subRegion, country
    return colors[depth] || '#dcdcdc';
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

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
 
  private onResize = () => {
    this.createSvg();
    this.drawChart();
  }

    
}

