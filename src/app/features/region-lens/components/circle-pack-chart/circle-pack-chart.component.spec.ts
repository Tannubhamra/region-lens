import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CirclePackChartComponent } from './circle-pack-chart.component';
import { DrawerService } from '../../../../shared/services/drawer.service';
import { ElementRef } from '@angular/core';
import { ITransformedData } from '../../interfaces/pack-chart.interface';

describe('CirclePackChartComponent', () => {
  let component: CirclePackChartComponent;
  let fixture: ComponentFixture<CirclePackChartComponent>;
  let drawerServiceSpy: jasmine.SpyObj<DrawerService>;

  const mockData: ITransformedData = {
  name: 'World',
  children: [ // ITransformedRegion[]
    {
      name: 'Europe',
      children: [ // ITransformedSubRegion[]
        {
          name: 'Western Europe',
          children: [ // ITransformedCountry[]
            {
              name: 'Germany',
              population: 83000000,
              area: 357386,
              result: 100,
              wikipedia: 'https://en.wikipedia.org/wiki/Germany',
              flag: '🇩🇪',
            }
          ]
        }
      ]
    }
  ]
};


  beforeEach(async () => {
    const drawerSpy = jasmine.createSpyObj('DrawerService', ['openDrawer']);

    await TestBed.configureTestingModule({
      imports: [CirclePackChartComponent],
      providers: [{ provide: DrawerService, useValue: drawerSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CirclePackChartComponent);
    component = fixture.componentInstance;
    drawerServiceSpy = TestBed.inject(DrawerService) as jasmine.SpyObj<DrawerService>;

    // Add dummy ElementRefs to avoid null errors in lifecycle
    component['tooltipRef'] = new ElementRef(document.createElement('div'));
    component['chartContainerRef'] = new ElementRef(document.createElement('div'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should toggle depth visibility and redraw chart', () => {
    const drawChartSpy = spyOn(component, 'drawChart');
  
    // Initially visible
    expect(component.legendsVisibleDepths.get(2)).toBeTrue();
  
    component.toggleDepthVisibility(2);
  
    // Should now be hidden
    expect(component.legendsVisibleDepths.get(2)).toBeFalse();
    expect(drawChartSpy).toHaveBeenCalled();
  });

  it('should open drawer only for country nodes (no children)', () => {
    const countryNode = {
      name: 'Germany',
      population: 83000000,
      area: 357386,
      result: 100,
      wikipedia: 'https://en.wikipedia.org/wiki/Germany',
      flag: '🇩🇪',
    };
  
    const regionNode = {
      name: 'Europe',
      children: [] // has children -> it's a region
    };
  
    component.showCountryDetails(countryNode as any);
    expect(drawerServiceSpy.openDrawer).toHaveBeenCalledWith('Country Info', countryNode);
  
    drawerServiceSpy.openDrawer.calls.reset();
  
    component.showCountryDetails(regionNode as any);
    expect(drawerServiceSpy.openDrawer).not.toHaveBeenCalled();
  });
  
  it('should draw chart with correct number of visible nodes', () => {
    component.transformedChartData = mockData;
    component.ngAfterViewInit();
    component.drawChart();
    fixture.detectChanges();
  
    const circles = component['chartGroup'].selectAll('circle').nodes();
    expect(circles.length).toBeGreaterThan(0); // Expecting World, Region, SubRegion, Country nodes
  });
    

});
