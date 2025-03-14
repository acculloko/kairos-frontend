import { AuthService } from './../../../services/auth/auth.service';
import { Component, Inject, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { ProjectService } from '../../../services/project/project.service';
import { TaskService } from '../../../services/task/task.service';
import { DateService } from '../../../services/date.service';

@Component({
  selector: 'app-timelog-creation-form',
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
    MatTimepickerModule,
  ],
  templateUrl: './timelog-creation-form.component.html',
  styleUrls: [
    './timelog-creation-form.component.scss',
    '../../../../styles.scss',
  ],
})
export class TimelogCreationFormComponent {
  userService = inject(UserService);
  taskService = inject(TaskService);
  authService = inject(AuthService);
  dateService = inject(DateService);

  form: FormGroup;

  tasks: any[] = [];
  filteredTasks: any[] = [];
  selectedTaskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TimelogCreationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      task: ['', Validators.required],
    });
  }

  getTasks() {
    const query = this.form.get('task')?.value;
    if (query.length > 1) {
      this.taskService.getTasksByUserId(this.data.userId).subscribe((tasks) => {
        this.tasks = tasks;
        console.log('tasks:', tasks);
        this.filteredTasks = this.tasks.filter((task) =>
          task.name.toLowerCase().includes(query.toLowerCase())
        );
        console.log('filtered tasks: ', this.filteredTasks);
      });
    }
  }

  selectTask(task: any): void {
    this.selectedTaskId = task.id;
  }

  submitForm() {
    if (this.form.valid && this.selectedTaskId) {
      this.form.value.user = this.authService.getUserInfo()?.id;
      this.form.value.task = this.selectedTaskId;
      console.log('Timelog Form Values:', this.form.value);
      this.dialogRef.close(this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }

  closeDialog() {
    this.form.reset();
    this.dialogRef.close(null);
  }
}
