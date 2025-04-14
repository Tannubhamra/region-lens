
import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, EventEmitter, Input, Output, Signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drawer',
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  standalone:true
})
export class DrawerComponent {
  @Input() drawerTitle!: Signal<string>;
  @Input() drawerContent!: Signal<any | null>;
  @Input() showDrawer!: Signal<boolean>;
  @Output() hide = new EventEmitter<void>();

  @ViewChild('drawer') drawer!: ElementRef;

  constructor() {
    effect(() => {
      const isOpen = this.showDrawer?.();
      const drawerEl = this.drawer?.nativeElement;
      if (!drawerEl) return;

      if (isOpen) {
        drawerEl.classList.remove('translate-x-full');
        drawerEl.classList.add('translate-x-0');
      } else {
        drawerEl.classList.remove('translate-x-0');
        drawerEl.classList.add('translate-x-full');
      }
    });
  }

  hideDrawer() {
    this.hide.emit();
  }
}
