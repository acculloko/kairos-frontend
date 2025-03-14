import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-delete-confirmation',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './project-delete-confirmation.component.html',
  styleUrls: [
    './project-delete-confirmation.component.scss',
    '../../../../styles.scss',
  ],
})
export class ProjectDeleteConfirmationComponent {
  constructor(
    private dialogRef: MatDialogRef<ProjectDeleteConfirmationComponent>
  ) {}

  submitForm() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
