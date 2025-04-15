import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class DrawerService {
  drawerTitle = signal<string>('');
  drawerContent = signal<any | null>(null);
  isOpen = signal(false);

  openDrawer(title: string, content: any) {
    this.isOpen.set(true);
    this.drawerTitle.set(title);
    this.drawerContent.set(content);
  }

  closeDrawer() {
    this.isOpen.set(false);
    this.drawerContent.set(null);
  }
}
