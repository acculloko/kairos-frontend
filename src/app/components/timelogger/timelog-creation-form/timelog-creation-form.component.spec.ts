import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelogCreationFormComponent } from './timelog-creation-form.component';

describe('TimelogCreationFormComponent', () => {
  let component: TimelogCreationFormComponent;
  let fixture: ComponentFixture<TimelogCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelogCreationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelogCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
