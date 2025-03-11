import { TaskService } from './../../services/task/task.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './../../services/auth/auth.service';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DashboardTestComponent } from '../../components/dashboard/dashboard-test/dashboard-test.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { TimelogService } from '../../services/timelog/timelog.service';
import { DateService } from '../../services/date.service';
import { Task } from '../../models/task/task.type';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardTestComponent,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  dateService = inject(DateService);
  taskService = inject(TaskService);
  timelogService = inject(TimelogService);
  breakpointObserver = inject(BreakpointObserver);
  matSnackBar = inject(MatSnackBar);

  role: string = this.authService.getUserInfo()?.role ?? '';

  cols: number = 4;

  // N Hours
  nHours: number = 0;

  // Total Hours
  totalHours: number = 0;

  // N Tasks
  nTasks: number = 0;

  // Total Tasks
  totalTasks: number = 0;

  // Overdue Tasks
  @ViewChild('overduePaginator') overduePaginator!: MatPaginator;
  overdueTaskList: Array<Task> = [];
  overdueTaskDataSource = new MatTableDataSource<Task>();
  overdueDisplayedColumns: string[] = [
    'id',
    'name',
    'project',
    'responsible_user',
    'end_date',
  ];

  // Upcoming Tasks
  @ViewChild('upcomingPaginator') upcomingPaginator!: MatPaginator;
  upcomingTaskList: Array<Task> = [];
  upcomingTaskDataSource = new MatTableDataSource<Task>();
  upcomingDisplayedColumns: string[] = [
    'id',
    'name',
    'project',
    'responsible_user',
    'end_date',
  ];

  ngOnInit(): void {
    // N Hours
    this.getNHours();

    // Total Hours
    this.getTotalHours();

    // N Tasks
    this.getNTasks();

    // Total Tasks
    this.getTotalTasks();

    // Overdue Tasks
    this.getOverdueTasks();

    // Upcoming Tasks
    this.getUpcomingTasks();

    // Changes column number based on screen size
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large])
      .pipe(
        map((result) => {
          if (result.breakpoints[Breakpoints.Medium]) {
            return 2;
          } else if (result.breakpoints[Breakpoints.Large]) {
            return 4;
          }
          return 4;
        })
      )
      .subscribe((cols) => {
        this.cols = cols;
      });
  }

  getNHours() {
    this.timelogService
      .getTotalHoursByUser(this.authService.getUserInfo()?.id ?? '')
      .subscribe({
        next: (response: any) => {
          this.nHours = response.total;
        },
      });
  }

  getTotalHours() {
    this.timelogService.getTotalHours().subscribe({
      next: (response: any) => {
        this.totalHours = response.total;
      },
    });
  }

  getNTasks() {
    this.taskService
      .getTotalActiveTasksByUser(this.authService.getUserInfo()?.id ?? '')
      .subscribe({
        next: (response: any) => {
          this.nTasks = response.count;
        },
      });
  }

  getTotalTasks() {
    this.taskService.getTotalActiveTasks().subscribe({
      next: (response: any) => {
        this.totalTasks = response.count;
      },
    });
  }

  getOverdueTasks() {
    this.taskService.getOverdueTasks().subscribe({
      next: (response: any) => {
        this.overdueTaskList = response.map((task: Task) => ({
          ...task,
          start_date: this.dateService.parseDate(task.start_date, 'dd/MM/yyyy'),
          end_date: this.dateService.parseDate(task.end_date, 'dd/MM/yyyy'),
          creation_date: this.dateService.parseDate(
            task.creation_date,
            'dd/MM/yyyy HH:mm:ss'
          ),
          responsible_user: {
            ...task.responsible_user,
            creation_date: this.dateService.parseDate(
              task.responsible_user.creation_date,
              'dd/MM/yyyy HH:mm:ss'
            ),
            last_login: task.responsible_user.last_login
              ? this.dateService.parseDate(
                  task.responsible_user.last_login,
                  'dd/MM/yyyy HH:mm:ss'
                )
              : null,
          },
          project: {
            ...task.project,
            start_date: this.dateService.parseDate(
              task.project.start_date,
              'dd/MM/yyyy'
            ),
            end_date: this.dateService.parseDate(
              task.project.end_date,
              'dd/MM/yyyy'
            ),
            creation_date: this.dateService.parseDate(
              task.project.creation_date,
              'dd/MM/yyyy HH:mm:ss'
            ),
          },
        }));

        this.overdueTaskDataSource = new MatTableDataSource<Task>(
          this.overdueTaskList
        );
        console.log(this.overdueTaskDataSource);
      },
      error: (err) => {
        console.error(err);
        throw err;
      },
      complete: () => {
        this.overdueTaskDataSource.paginator = this.overduePaginator;
      },
    });
  }

  getUpcomingTasks() {
    this.taskService
      .getUpcomingTasks(this.authService.getUserInfo()?.id ?? '')
      .subscribe({
        next: (response: any) => {
          this.upcomingTaskList = response.map((task: Task) => ({
            ...task,
            start_date: this.dateService.parseDate(
              task.start_date,
              'dd/MM/yyyy'
            ),
            end_date: this.dateService.parseDate(task.end_date, 'dd/MM/yyyy'),
            creation_date: this.dateService.parseDate(
              task.creation_date,
              'dd/MM/yyyy HH:mm:ss'
            ),
            responsible_user: {
              ...task.responsible_user,
              creation_date: this.dateService.parseDate(
                task.responsible_user.creation_date,
                'dd/MM/yyyy HH:mm:ss'
              ),
              last_login: task.responsible_user.last_login
                ? this.dateService.parseDate(
                    task.responsible_user.last_login,
                    'dd/MM/yyyy HH:mm:ss'
                  )
                : null,
            },
            project: {
              ...task.project,
              start_date: this.dateService.parseDate(
                task.project.start_date,
                'dd/MM/yyyy'
              ),
              end_date: this.dateService.parseDate(
                task.project.end_date,
                'dd/MM/yyyy'
              ),
              creation_date: this.dateService.parseDate(
                task.project.creation_date,
                'dd/MM/yyyy HH:mm:ss'
              ),
            },
          }));

          this.upcomingTaskDataSource = new MatTableDataSource<Task>(
            this.upcomingTaskList
          );
          console.log(this.upcomingTaskDataSource);
        },
        error: (err) => {
          console.error(err);
          throw err;
        },
        complete: () => {
          this.upcomingTaskDataSource.paginator = this.upcomingPaginator;
        },
      });
  }
}
