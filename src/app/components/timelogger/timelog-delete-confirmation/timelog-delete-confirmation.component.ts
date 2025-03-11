import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-timelog-delete-confirmation',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './timelog-delete-confirmation.component.html',
  styleUrl: './timelog-delete-confirmation.component.scss',
})
export class TimelogDeleteConfirmationComponent {
  constructor(
    private dialogRef: MatDialogRef<TimelogDeleteConfirmationComponent>
  ) {}

  submitForm() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
