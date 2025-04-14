import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionLensComponent } from './region-lens.component';

describe('RegionLensComponent', () => {
  let component: RegionLensComponent;
  let fixture: ComponentFixture<RegionLensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionLensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionLensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
