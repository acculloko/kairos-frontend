import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelogEditingFormComponent } from './timelog-editing-form.component';

describe('TimelogEditingFormComponent', () => {
  let component: TimelogEditingFormComponent;
  let fixture: ComponentFixture<TimelogEditingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelogEditingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelogEditingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
