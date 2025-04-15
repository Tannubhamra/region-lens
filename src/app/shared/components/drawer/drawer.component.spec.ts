import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerComponent } from './drawer.component';
import { signal } from '@angular/core';

describe('DrawerComponent', () => {
  let component: DrawerComponent;
  let fixture: ComponentFixture<DrawerComponent>;

  const drawerTitle = signal('Details');
  const showDrawer = signal(false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerComponent);
    component = fixture.componentInstance;

     // Set signals
     component.drawerTitle = drawerTitle;
     component.showDrawer = showDrawer;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit hide event when hideDrawer is called', () => {
    spyOn(component.hide, 'emit');

    component.hideDrawer();

    expect(component.hide.emit).toHaveBeenCalled();
  });
});
