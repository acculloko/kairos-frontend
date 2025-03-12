import { CommonModule } from '@angular/common';
import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { format } from 'date-fns';
import { MatIconModule } from '@angular/material/icon';
import { TimelogService } from '../../../services/timelog/timelog.service';
import { TaskService } from '../../../services/task/task.service';
import { DateService } from '../../../services/date.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Timelog } from '../../../models/timelog/timelog.type';

@Component({
  selector: 'app-admin-timelogger',
  imports: [
    MatTableModule,
    MatButtonModule,
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './admin-timelogger.component.html',
  styleUrl: './admin-timelogger.component.scss',
})
export class AdminTimeloggerComponent implements OnInit {
  dialog = inject(MatDialog);
  ngZone = inject(NgZone);
  timelogService = inject(TimelogService);
  taskService = inject(TaskService);
  dateService = inject(DateService);
  authService = inject(AuthService);

  //MatTable
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'description',
    'user',
    'task',
    'start_date',
    'end_date',
    'log_time',
  ];

  selectedFilterField: string = 'name';
  filterableFields = [
    { label: 'Id', value: 'id' },
    { label: 'Description', value: 'description' },
    { label: 'User', value: 'user.name' },
    { label: 'Task', value: 'task.name' },
    { label: 'Start Date', value: 'start_date' },
    { label: 'End Date', value: 'end_date' },
    { label: 'Logged At', value: 'log_time' },
  ];

  timelogList: Array<Timelog> = [];
  timelogDataSource = new MatTableDataSource<Timelog>();

  ngOnInit(): void {
    this.authService.getUserInfo();
    this.getLogs();
  }

  getLogs() {
    this.timelogService.getLogs().subscribe({
      next: (response: any) => {
        this.timelogList = response.map((timelog: Timelog) => ({
          ...timelog,
          start_date: this.dateService.parseDate(
            timelog.start_date,
            'dd/MM/yyyy HH:mm:ss'
          ),
          end_date: this.dateService.parseDate(
            timelog.end_date,
            'dd/MM/yyyy HH:mm:ss'
          ),
          log_time: this.dateService.parseDate(
            timelog.log_time,
            'dd/MM/yyyy HH:mm:ss'
          ),
          task: {
            ...timelog.task,
            start_date: this.dateService.parseDate(
              timelog.task.start_date,
              'dd/MM/yyyy'
            ),
            end_date: this.dateService.parseDate(
              timelog.task.end_date,
              'dd/MM/yyyy'
            ),
            creation_date: this.dateService.parseDate(
              timelog.task.creation_date,
              'dd/MM/yyyy HH:mm:ss'
            ),
            responsible_user: {
              ...timelog.task.responsible_user,
              creation_date: this.dateService.parseDate(
                timelog.task.responsible_user.creation_date,
                'dd/MM/yyyy HH:mm:ss'
              ),
              last_login: timelog.task.responsible_user.last_login
                ? this.dateService.parseDate(
                    timelog.task.responsible_user.last_login,
                    'dd/MM/yyyy HH:mm:ss'
                  )
                : null,
            },
            project: {
              ...timelog.task.project,
              start_date: this.dateService.parseDate(
                timelog.task.project.start_date,
                'dd/MM/yyyy'
              ),
              end_date: this.dateService.parseDate(
                timelog.task.project.end_date,
                'dd/MM/yyyy'
              ),
              creation_date: this.dateService.parseDate(
                timelog.task.project.creation_date,
                'dd/MM/yyyy HH:mm:ss'
              ),
            },
          },
          user: {
            ...timelog.user,
            creation_date: this.dateService.parseDate(
              timelog.user.creation_date,
              'dd/MM/yyyy HH:mm:ss'
            ),
            last_login: this.dateService.parseDate(
              timelog.user.last_login,
              'dd/MM/yyyy HH:mm:ss'
            ),
          },
        }));

        this.timelogDataSource = new MatTableDataSource<Timelog>(
          this.timelogList
        );
        // console.log(this.timelogDataSource);
      },
      error: (err) => {
        console.error(err);
        throw err;
      },
      complete: () => {
        this.timelogDataSource.paginator = this.paginator;
        this.timelogDataSource.sort = this.sort;
        this.setupFilterPredicate();
        this.setupSorting();
      },
    });
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.timelogDataSource.filter = searchValue.trim().toLowerCase();
  }

  setupFilterPredicate() {
    this.timelogDataSource.filterPredicate = (
      data: Timelog,
      filter: string
    ) => {
      if (!this.selectedFilterField || !filter) return true;

      let fieldValue: string = '';

      if (this.selectedFilterField === 'id') {
        fieldValue = data.id.toString();
      } else if (this.selectedFilterField === 'start_date' && data.start_date) {
        fieldValue =
          this.dateService.formatDate(data.start_date, 'dd/MM/yyyy HH:mm:ss') ||
          '';
      } else if (this.selectedFilterField === 'end_date' && data.end_date) {
        fieldValue =
          this.dateService.formatDate(data.end_date, 'dd/MM/yyyy HH:mm:ss') ||
          '';
      } else if (this.selectedFilterField === 'log_time' && data.log_time) {
        fieldValue =
          this.dateService.formatDate(data.log_time, 'dd/MM/yyyy HH:mm:ss') ||
          '';
      } else if (this.selectedFilterField === 'user.name' && data.user) {
        fieldValue = data.user.name || '';
      } else if (this.selectedFilterField === 'task.name' && data.task) {
        fieldValue = data.task.name || '';
      } else {
        fieldValue = (data as any)[this.selectedFilterField] || '';
      }

      return fieldValue.toLowerCase().includes(filter.toLowerCase());
    };
  }

  setupSorting() {
    this.timelogDataSource.sortingDataAccessor = (
      item: Timelog,
      property: string
    ): string | number => {
      if (
        property === 'start_date' ||
        property === 'end_date' ||
        property === 'log_time'
      ) {
        return item[property as keyof Timelog]
          ? new Date(item[property as keyof Timelog] as string).getTime()
          : 0;
      }

      if (property === 'user') {
        return item.user?.name?.toLowerCase() ?? '';
      } else if (property === 'task') {
        return item.task?.name?.toLowerCase() ?? '';
      }

      const value = item[property as keyof Timelog];

      if (typeof value === 'string') {
        return value.toLowerCase(); // Normalize all strings to lowercase for sorting
      }

      return typeof value === 'number' || typeof value === 'string'
        ? value
        : '';
    };
  }
}
