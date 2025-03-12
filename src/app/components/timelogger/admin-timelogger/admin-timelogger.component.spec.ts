import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTimeloggerComponent } from './admin-timelogger.component';

describe('AdminTimeloggerComponent', () => {
  let component: AdminTimeloggerComponent;
  let fixture: ComponentFixture<AdminTimeloggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTimeloggerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTimeloggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
