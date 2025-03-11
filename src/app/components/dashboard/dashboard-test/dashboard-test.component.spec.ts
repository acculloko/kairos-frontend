import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTestComponent } from './dashboard-test.component';

describe('DashboardTestComponent', () => {
  let component: DashboardTestComponent;
  let fixture: ComponentFixture<DashboardTestComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
