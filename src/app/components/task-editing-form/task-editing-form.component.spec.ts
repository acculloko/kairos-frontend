import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditingFormComponent } from './task-editing-form.component';

describe('TaskEditingFormComponent', () => {
  let component: TaskEditingFormComponent;
  let fixture: ComponentFixture<TaskEditingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEditingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
