import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeloggerComponent } from './timelogger.component';

describe('TimeloggerComponent', () => {
  let component: TimeloggerComponent;
  let fixture: ComponentFixture<TimeloggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeloggerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeloggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
