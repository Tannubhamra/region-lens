import { Injectable, signal } from '@angular/core';
import { ITransformedCountry, ITransformedData } from '../../features/region-lens/interfaces/pack-chart.interface';
import { ICountry } from '../../features/region-lens/interfaces/region.interface';

@Injectable({ providedIn: 'root' })

export class DrawerService {
  drawerTitle = signal<string>('');
  drawerContent = signal<ITransformedCountry | null>(null);
  isOpen = signal(false);

  openDrawer(title: string, content: ITransformedCountry): void {
    this.isOpen.set(true);
    this.drawerTitle.set(title);
    this.drawerContent.set(content);
  }

  closeDrawer(): void {
    this.isOpen.set(false);
    this.drawerContent.set(null);
  }
}
