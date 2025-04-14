import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class DrawerService {
  // Signal to track if the drawer is open
  drawerTitle = signal<string>('');
  drawerContent = signal<any | null>(null);
  isOpen = signal(false);

  openDrawer(title: string, content: any) {
    this.drawerTitle.set(title);
    this.drawerContent.set(content);
    this.isOpen.set(true);
  }

  closeDrawer() {
    this.isOpen.set(false);
    this.drawerContent.set(null);
  }
}
