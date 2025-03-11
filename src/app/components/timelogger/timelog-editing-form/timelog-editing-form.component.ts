import { AuthService } from './../../../services/auth/auth.service';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { ProjectService } from '../../../services/project/project.service';
import { TaskService } from '../../../services/task/task.service';
import { DateService } from '../../../services/date.service';
import { TimelogService } from '../../../services/timelog/timelog.service';

@Component({
  selector: 'app-timelog-editing-form',
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
  templateUrl: './timelog-editing-form.component.html',
  styleUrl: './timelog-editing-form.component.scss',
})
export class TimelogEditingFormComponent implements OnInit {
  userService = inject(UserService);
  taskService = inject(TaskService);
  authService = inject(AuthService);
  dateService = inject(DateService);
  timelogService = inject(TimelogService);

  form: FormGroup;

  tasks: any[] = [];
  filteredTasks: any[] = [];
  selectedTaskId: number | null = null;

  selectedUserId: number | null = null;

  startDate!: Date;
  startTime!: string;
  endDate!: Date;
  endTime!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TimelogEditingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
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

  ngOnInit(): void {
    this.timelogService.getLogById(this.data.id).subscribe((entry) => {
      this.form.patchValue(entry);
      this.form.patchValue({
        task: entry.task.name,
      });
      this.setInitialDateTimeValues({
        start: entry.start_date,
        end: entry.end_date,
      });
      this.selectedUserId = entry.user.id;
      this.selectedTaskId = entry.task.id;
    });
  }

  getTasks() {
    const query = this.form.get('task')?.value;
    if (query.length > 1 && this.selectedUserId) {
      this.taskService
        .getTasksByUserId(this.selectedUserId)
        .subscribe((tasks) => {
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

  setInitialDateTimeValues(data: { start: string; end: string }) {
    // Convert datetime strings to Date objects
    const startDateTime = new Date(data.start);
    const endDateTime = new Date(data.end);

    // Extract only the date part
    const startDate = startDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
    const endDate = endDateTime.toISOString().split('T')[0]; // YYYY-MM-DD

    // Extract only the time part in HH:mm format
    const startTime = startDateTime.toTimeString().slice(0, 5); // HH:mm
    const endTime = endDateTime.toTimeString().slice(0, 5); // HH:mm

    // Set form values
    this.form.patchValue({
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime,
    });
  }

  submitForm() {
    if (this.form.valid && this.selectedTaskId) {
      this.form.value.user = this.selectedUserId;
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
