import { AuthService } from './../../../services/auth/auth.service';
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
  ],
  templateUrl: './timelog-creation-form.component.html',
  styleUrl: './timelog-creation-form.component.scss',
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

  startDate!: Date;
  startTime!: string;
  endDate!: Date;
  endTime!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TimelogCreationFormComponent>
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_date: ['', Validators.required],
      end_time: ['', Validators.required],
      task: ['', Validators.required],
    });
  }

  getTasks() {
    const query = this.form.get('task')?.value;
    if (query.length > 1) {
      this.taskService.getTasks().subscribe((tasks) => {
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

  combineDateTime(fieldName: string): Date | null {
    const dateValue = this.form.value[`${fieldName}_date`];
    const timeValue = this.form.value[`${fieldName}_time`];

    if (!dateValue || !timeValue) {
      console.error(`${fieldName} date or time is missing!`);
      return null;
    }

    const [hours, minutes] = timeValue.split(':').map(Number);
    const combinedDateTime = new Date(dateValue);
    combinedDateTime.setHours(hours, minutes, 0);

    return combinedDateTime;
  }

  submitForm() {
    if (this.form.valid && this.selectedTaskId) {
      this.form.value.user = this.authService.getUserInfo()?.id;
      this.form.value.task = this.selectedTaskId;
      this.form.value.start_date = this.combineDateTime('start');
      this.form.value.end_date = this.combineDateTime('end');
      console.log('Timelog Form Values:', this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
