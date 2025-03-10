import { DateService } from './../../services/date.service';
import { ProjectService } from './../../services/project/project.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-project-editing-form',
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
  templateUrl: './project-editing-form.component.html',
  styleUrl: './project-editing-form.component.scss',
})
export class ProjectEditingFormComponent implements OnInit {
  userService = inject(UserService);
  projectService = inject(ProjectService);
  dateService = inject(DateService);

  form: FormGroup;
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectEditingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      status: ['', Validators.required],
      responsible_user: ['', Validators.required],
      priority: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.projectService.getProjectById(this.data.id).subscribe((entry) => {
      this.form.patchValue(entry);
      this.form.patchValue({
        responsible_user: entry.responsible_user.name,
        start_date: this.dateService.parseDate(entry.start_date, 'dd/MM/yyyy'),
        end_date: this.dateService.parseDate(entry.end_date, 'dd/MM/yyyy'),
      });
      this.selectedUserId = entry.responsible_user.id;
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

  submitForm() {
    if (this.form.valid && this.selectedUserId) {
      this.form.value.responsible_user = this.selectedUserId;
      console.log('Project Form Values:', this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
