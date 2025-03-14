import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-delete-confirmation',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './user-delete-confirmation.component.html',
  styleUrls: [
    './user-delete-confirmation.component.scss',
    '../../../../styles.scss',
  ],
})
export class UserDeleteConfirmationComponent {
  constructor(
    private dialogRef: MatDialogRef<UserDeleteConfirmationComponent>
  ) {}

  submitForm() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
