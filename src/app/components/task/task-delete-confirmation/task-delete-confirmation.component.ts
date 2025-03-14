import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-delete-confirmation',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './task-delete-confirmation.component.html',
  styleUrls: [
    './task-delete-confirmation.component.scss',
    '../../../../styles.scss',
  ],
})
export class TaskDeleteConfirmationComponent {
  constructor(
    private dialogRef: MatDialogRef<TaskDeleteConfirmationComponent>
  ) {}

  submitForm() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
