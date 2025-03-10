import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDeleteConfirmationComponent } from './project-delete-confirmation.component';

describe('ProjectDeleteConfirmationComponent', () => {
  let component: ProjectDeleteConfirmationComponent;
  let fixture: ComponentFixture<ProjectDeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDeleteConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
