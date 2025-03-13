import { TaskService } from './../../services/task/task.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './../../services/auth/auth.service';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { UserHoursComponent } from '../../components/dashboard/user-hours/user-hours.component';
import { ActiveProjectsComponent } from '../../components/dashboard/active-projects/active-projects.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    UserHoursComponent,
    ActiveProjectsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../../styles.scss'],
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  dateService = inject(DateService);
  taskService = inject(TaskService);
  timelogService = inject(TimelogService);
  breakpointObserver = inject(BreakpointObserver);
  snackBar = inject(MatSnackBar);

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
    'status',
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
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
      ])
      .pipe(
        map((result) => {
          if (result.breakpoints[Breakpoints.XSmall]) {
            return 2;
          } else if (result.breakpoints[Breakpoints.Small]) {
            return 2;
          } else if (result.breakpoints[Breakpoints.Medium]) {
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
        error: (err) => {
          this.snackBar.open("Couldn't get My Total Hours!", 'Dismiss', {
            panelClass: ['error-snackbar'],
          });
          console.error(err);
          throw err;
        },
      });
  }

  getTotalHours() {
    this.timelogService.getTotalHours().subscribe({
      next: (response: any) => {
        this.totalHours = response.total;
      },
      error: (err) => {
        this.snackBar.open("Couldn't get Total Hours!", 'Dismiss', {
          panelClass: ['error-snackbar'],
        });
        console.error(err);
        throw err;
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
        error: (err) => {
          this.snackBar.open("Couldn't get My Active Tasks!", 'Dismiss', {
            panelClass: ['error-snackbar'],
          });
          console.error(err);
          throw err;
        },
      });
  }

  getTotalTasks() {
    this.taskService.getTotalActiveTasks().subscribe({
      next: (response: any) => {
        this.totalTasks = response.count;
      },
      error: (err) => {
        this.snackBar.open("Couldn't get Total Active Tasks!", 'Dismiss', {
          panelClass: ['error-snackbar'],
        });
        console.error(err);
        throw err;
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
          responsible_user: task.responsible_user
            ? {
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
              }
            : null,
          project: task.project
            ? {
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
              }
            : null,
        }));

        this.overdueTaskDataSource = new MatTableDataSource<Task>(
          this.overdueTaskList
        );
        console.log(this.overdueTaskDataSource);
      },
      error: (err) => {
        this.snackBar.open("Couldn't get Overdue Tasks!", 'Dismiss', {
          panelClass: ['error-snackbar'],
        });
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
            responsible_user: task.responsible_user
              ? {
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
                }
              : null,
            project: task.project
              ? {
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
                }
              : null,
          }));

          this.upcomingTaskDataSource = new MatTableDataSource<Task>(
            this.upcomingTaskList
          );
          console.log(this.upcomingTaskDataSource);
        },
        error: (err) => {
          this.snackBar.open("Couldn't get Upcoming Tasks!", 'Dismiss', {
            panelClass: ['error-snackbar'],
          });
          console.error(err);
          throw err;
        },
        complete: () => {
          this.upcomingTaskDataSource.paginator = this.upcomingPaginator;
        },
      });
  }
}
