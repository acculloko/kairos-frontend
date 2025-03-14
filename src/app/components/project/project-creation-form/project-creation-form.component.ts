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

@Component({
  selector: 'app-project-creation-form',
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
  templateUrl: './project-creation-form.component.html',
  styleUrls: [
    './project-creation-form.component.scss',
    '../../../../styles.scss',
  ],
})
export class ProjectCreationFormComponent {
  userService = inject(UserService);

  form: FormGroup;
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectCreationFormComponent>
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
    this.form.reset();
    this.dialogRef.close(null);
  }
}
