import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEditingFormComponent } from './project-editing-form.component';

describe('ProjectEditingFormComponent', () => {
  let component: ProjectEditingFormComponent;
  let fixture: ComponentFixture<ProjectEditingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEditingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectEditingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
