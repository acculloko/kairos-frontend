import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { ProjectService } from '../../../services/project/project.service';

@Component({
  selector: 'app-task-creation-form',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    CommonModule,
  ],
  templateUrl: './task-creation-form.component.html',
  styleUrl: './task-creation-form.component.scss',
})
export class TaskCreationFormComponent {
  userService = inject(UserService);
  projectService = inject(ProjectService);

  form: FormGroup;

  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUserId: number | null = null;

  projects: any[] = [];
  filteredProjects: any[] = [];
  selectedProjectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskCreationFormComponent>
  ) {
    this.form = this.fb.group({
      project: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      status: ['', Validators.required],
      responsible_user: ['', Validators.required],
    });
  }

  getUsers() {
    const query = this.form.get('responsible_user')?.value;
    if (query.length > 1) {
      this.userService.getUsers().subscribe((users) => {
        this.users = users;
        this.filteredUsers = this.users.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
      });
    }
  }

  selectUser(user: any): void {
    this.selectedUserId = user.id;
  }

  getProjects() {
    const query = this.form.get('project')?.value;
    if (query.length > 1) {
      this.projectService.getProjects().subscribe((projects) => {
        this.projects = projects;
        console.log('projects:', projects);
        this.filteredProjects = this.projects.filter((project) =>
          project.name.toLowerCase().includes(query.toLowerCase())
        );
        console.log('filtered projects: ', this.filteredProjects);
      });
    }
  }

  selectProject(project: any): void {
    this.selectedProjectId = project.id;
  }

  submitForm() {
    if (this.form.valid && this.selectedUserId && this.selectedProjectId) {
      this.form.value.responsible_user = this.selectedUserId;
      this.form.value.project = this.selectedProjectId;
      console.log('Task Form Values:', this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
