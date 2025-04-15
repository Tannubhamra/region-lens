import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output, Signal, signal} from '@angular/core';
import { RegionService } from './services/region.service';
import { IRegionLens } from './interfaces/region.interface';
import { CommonModule } from '@angular/common';
import { CirclePackChartComponent } from "./components/circle-pack-chart/circle-pack-chart.component";
import { transformRegionLensToPackData, ValueMode } from './components/circle-pack-chart/transform.utils';
import { ITransformedData } from './interfaces/pack-chart.interface';
import { DrawerComponent } from "../../shared/components/drawer/drawer.component";
import { DrawerService } from '../../shared/services/drawer.service';
import { CountryDetailComponent } from "./components/country-detail/country-detail.component";

@Component({
  selector: 'app-region-lens',
  standalone:true,
  imports: [CommonModule, CirclePackChartComponent, DrawerComponent, CountryDetailComponent],
  templateUrl: './region-lens.component.html',
  styleUrl: './region-lens.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionLensComponent {
  @Input() isOpen: boolean = false;
  @Input() data: any;
  @Output() close = new EventEmitter<void>();

  regionLensData = signal<IRegionLens>({});
  mode: ValueMode = 'population'; 
  valueMode = signal<ValueMode>('population');

  private regionService = inject(RegionService);
  drawerService = inject(DrawerService);
  
  constructor(){
    this.getAllRegions();
  }

  getAllRegions(){
    this.regionService.getRegions().subscribe({
      next : (data: IRegionLens) => {
      this.regionLensData.set(data);  
    },
      error : (err) =>{
      console.error('Error fetching Region data:', err);
    }
  });
  }

  toggleData(): void {
    this.valueMode.set(this.valueMode() === 'population' ? 'area' : 'population');
  }

  transformedData: Signal<ITransformedData> = computed(() =>
    transformRegionLensToPackData(this.regionLensData(), this.valueMode())
  );

}


