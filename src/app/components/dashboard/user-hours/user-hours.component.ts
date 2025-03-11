import { DateService } from './../../../services/date.service';
import { TimelogService } from './../../../services/timelog/timelog.service';
import { MatInputModule } from '@angular/material/input';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { Observable, startWith, map } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../models/user/user.type';

@Component({
  selector: 'app-user-hours',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-hours.component.html',
  styleUrl: './user-hours.component.scss',
})
export class UserHoursComponent implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  timelogService = inject(TimelogService);
  dateService = inject(DateService);

  form: FormGroup;

  users: any[] = [];
  filteredUsers: any[] = [];

  selectedUserName: string = '';
  selectedUserId: number | string = '';

  isFirstLoad = true;
  isAdmin = false;
  totalHours = 0;

  constructor(private fb: FormBuilder) {
    if (this.authService.getUserInfo()?.role === 'ADMIN') {
      this.isAdmin = true;
    }

    this.form = this.fb.group({
      start_date: [new Date(), Validators.required],
      end_date: [new Date(), Validators.required],
      responsible_user: [
        { value: this.selectedUserName, disabled: !this.isAdmin },
        Validators.required,
      ],
    });
  }

  ngOnInit() {
    this.selectedUserId = this.authService.getUserInfo()?.id ?? '';
    this.selectedUserName = this.authService.getUserInfo()?.name ?? '';

    if (this.isFirstLoad) {
      this.form.patchValue({
        responsible_user: this.selectedUserName,
      });
      this.calculateHours();
    }

    this.form.valueChanges.subscribe(() => {
      this.calculateHours();
    });
  }

  private _filterUsers(value: string): { id: number; name: string }[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user) =>
      user.username.toLowerCase().includes(filterValue)
    );
  }

  calculateHours() {
    // if (
    //   this.timeLogForm.controls.user.value &&
    //   this.timeLogForm.controls.user.value in this.users
    // ) {
    //   this.userService.ge;
    // }
    const start = this.dateService.formatDateToString(
      this.form.value.start_date
    );
    const end = this.dateService.formatDateToString(this.form.value.end_date);
    console.log(this.selectedUserId, start, end);
    this.timelogService
      .getTotalHoursByUserOverPeriod(this.selectedUserId, start, end)
      .subscribe({
        next: (response: any) => {
          this.totalHours = response.total;
        },
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

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.calculateHours();
  }
}
