import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDeleteConfirmationComponent } from './task-delete-confirmation.component';

describe('TaskDeleteConfirmationComponent', () => {
  let component: TaskDeleteConfirmationComponent;
  let fixture: ComponentFixture<TaskDeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDeleteConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
