import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclePackChartComponent } from './circle-pack-chart.component';

describe('CirclePackChartComponent', () => {
  let component: CirclePackChartComponent;
  let fixture: ComponentFixture<CirclePackChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CirclePackChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CirclePackChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
