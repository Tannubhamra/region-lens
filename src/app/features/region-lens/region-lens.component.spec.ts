import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionLensComponent } from './region-lens.component';
import { IRegionLens } from './interfaces/region.interface';
import { of } from 'rxjs';
import { RegionService } from './services/region.service';
import { DrawerService } from '../../shared/services/drawer.service';
import { CommonModule } from '@angular/common';

describe('RegionLensComponent', () => {
  let component: RegionLensComponent;
  let fixture: ComponentFixture<RegionLensComponent>;
  let regionService: jasmine.SpyObj<RegionService>;

  beforeEach(async () => {
    // Create spies for the services
    regionService = jasmine.createSpyObj('RegionService', ['getRegions']);

    const mockData: IRegionLens = 
    {
      "Europe": {
        "Northern Europe": [
          {
            "country": "Denmark",
            "population": 5900000,
            "wikipedia": "https://en.wikipedia.org/wiki/Denmark",
            "flag": "https://flagcdn.com/w320/dk.png",
            "land_area_km2": 42924
          }
        ],
        "Western Europe": [
        {
          "country": "Austria",
          "population": 9100000,
          "wikipedia": "https://en.wikipedia.org/wiki/Austria",
          "flag": "https://flagcdn.com/w320/at.png",
          "land_area_km2": 83879
        }
      ]
    }
  };

   // Mock getRegions to return the observable with the mock data
   regionService.getRegions.and.returnValue(of(mockData));
   
    await TestBed.configureTestingModule({
      imports: [RegionLensComponent,CommonModule],
      providers:
      [
        { provide: RegionService, useValue: regionService }
      ]
     
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionLensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   it('should create the component', () => {
    // Ensure that the component was created and the method was called
    expect(component).toBeTruthy();
    expect(regionService.getRegions).toHaveBeenCalled();  // Ensure getRegions was called
    expect(component.regionLensData()).toEqual({
      "Europe": {
        "Northern Europe": [
          {
            "country": "Denmark",
            "population": 5900000,
            "wikipedia": "https://en.wikipedia.org/wiki/Denmark",
            "flag": "https://flagcdn.com/w320/dk.png",
            "land_area_km2": 42924
          }
        ],
        "Western Europe": [
          {
            "country": "Austria",
            "population": 9100000,
            "wikipedia": "https://en.wikipedia.org/wiki/Austria",
            "flag": "https://flagcdn.com/w320/at.png",
            "land_area_km2": 83879
          }
        ]
      }
    });
  });

  it('should toggle value mode between population and area', () => {
    expect(component.valueMode()).toBe('population');
    component.toggleData();
    expect(component.valueMode()).toBe('area');
    component.toggleData();
    expect(component.valueMode()).toBe('population');
  });


});
