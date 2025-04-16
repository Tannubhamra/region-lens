import { Component, effect, inject, signal } from '@angular/core';
import { DrawerService } from '../../../../shared/services/drawer.service';
import { CommonModule } from '@angular/common';
import { ITransformedCountry } from '../../interfaces/pack-chart.interface';

@Component({
  selector: 'app-country-detail',
  imports: [CommonModule],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
})
export class CountryDetailComponent {
  data = signal<ITransformedCountry | null>(null);
  drawerService = inject(DrawerService);

constructor() {
  effect(() => {
    this.data.set(this.drawerService.drawerContent())
  });
}
}
