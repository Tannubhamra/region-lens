import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { DrawerService } from '../../../../shared/services/drawer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-country-detail',
  imports: [CommonModule],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss'
})
export class CountryDetailComponent {
  data = signal<any>(null);
  
  drawerService = inject(DrawerService);

  get countryData() {
    return this.data();
  }
constructor() {
  effect(() => {
    this.data.set(this.drawerService.drawerContent())
  });
}
}
