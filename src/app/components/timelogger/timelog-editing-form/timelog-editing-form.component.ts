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
import { MatTimepickerModule } from '@angular/material/timepicker';

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
    MatTimepickerModule,
  ],
  templateUrl: './timelog-editing-form.component.html',
  styleUrls: [
    './timelog-editing-form.component.scss',
    '../../../../styles.scss',
  ],
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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TimelogEditingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      task: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.timelogService.getLogById(this.data.id).subscribe((entry) => {
      this.form.patchValue(entry);
      this.form.patchValue({
        task: entry.task.name,
        start_date: this.dateService.convertToDate(entry.start_date),
        end_date: this.dateService.convertToDate(entry.end_date),
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

  submitForm() {
    if (this.form.valid && this.selectedTaskId) {
      this.form.value.user = this.selectedUserId;
      this.form.value.task = this.selectedTaskId;
      console.log('Timelog Form Values:', this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }

  closeDialog() {
    this.form.reset();
    this.dialogRef.close(null);
  }
}
