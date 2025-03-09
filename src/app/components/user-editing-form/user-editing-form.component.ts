import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
  selector: 'app-user-editing-form',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './user-editing-form.component.html',
  styleUrl: './user-editing-form.component.scss',
})
export class UserEditingFormComponent implements OnInit {
  form: FormGroup;
  userService = inject(UserService);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserEditingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getUserById(this.data.id).subscribe((entry) => {
      this.form.patchValue(entry);
    });
  }

  submitForm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
