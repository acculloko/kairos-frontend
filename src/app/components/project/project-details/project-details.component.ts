import { TaskService } from '../../../services/task/task.service';
import { DateService } from '../../../services/date.service';
import { ProjectService } from '../../../services/project/project.service';
import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../../models/project/project.type';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task/task.type';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ProjectCreationRequest } from '../../../models/project/projectCreationRequest.type';
import { format } from 'date-fns';
import { ProjectDeleteConfirmationComponent } from '../project-delete-confirmation/project-delete-confirmation.component';
import { TaskCreationRequest } from '../../../models/task/taskCreationRequest.type';
import { TaskDeleteConfirmationComponent } from '../../task/task-delete-confirmation/task-delete-confirmation.component';
import { MatIconModule } from '@angular/material/icon';
import { ProjectEditingFormComponent } from '../project-editing-form/project-editing-form.component';
import { TaskCreationFormComponent } from '../../task/task-creation-form/task-creation-form.component';
import { TaskEditingFormComponent } from '../../task/task-editing-form/task-editing-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-project-details',
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
    MatDatepickerModule,
    MatCardModule,
  ],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss', '../../../../styles.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialog = inject(MatDialog);
  ngZone = inject(NgZone);
  projectService = inject(ProjectService);
  taskService = inject(TaskService);
  dateService = inject(DateService);

  snackBar = inject(MatSnackBar);

  project: any;

  //MatTable
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'responsible_user',
    'start_date',
    'end_date',
    'status',
    // 'creation_date',
    'actions',
  ];

  filterValues: {
    startDate?: Date;
    endDate?: Date;
    responsible_user?: string;
    status?: string;
    name?: string;
    description?: string;
  } = {};

  statusOptions: string[] = ['OPEN', 'ONGOING', 'DONE', 'PAUSED', 'CANCELLED'];

  taskList: Array<Task> = [];
  taskDataSource = new MatTableDataSource<Task>();

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      const parsedId = parseInt(projectId);
      this.getProjectDetails(parsedId);
      this.getTasks(parsedId);
    }
  }

  getProjectDetails(id: number) {
    this.projectService.getProjectById(id).subscribe((res: Project) => {
      this.project = {
        ...res,
        start_date: this.dateService.parseDate(res.start_date, 'dd/MM/yyyy'),
        end_date: this.dateService.parseDate(res.end_date, 'dd/MM/yyyy'),
        creation_date: this.dateService.parseDate(
          res.creation_date,
          'dd/MM/yyyy HH:mm:ss'
        ),
        responsible_user: res.responsible_user
          ? {
              ...res.responsible_user,
              name: res.responsible_user.name ?? 'No Linked User',
              creation_date: this.dateService.parseDate(
                res.responsible_user.creation_date,
                'dd/MM/yyyy HH:mm:ss'
              ),
              last_login: res.responsible_user.last_login
                ? this.dateService.parseDate(
                    res.responsible_user.last_login,
                    'dd/MM/yyyy HH:mm:ss'
                  )
                : null,
            }
          : null,
      };
    });
  }

  editProject(id: number) {
    const dialogRef = this.dialog.open(ProjectEditingFormComponent, {
      width: '600px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
      if (result) {
        const formattedResult: ProjectCreationRequest = {
          name: result.name,
          description: result.description,
          start_date: format(result.start_date, 'dd/MM/yyyy'),
          end_date: format(result.end_date, 'dd/MM/yyyy'),
          status: result.status,
          user_id: result.responsible_user,
          priority: result.priority,
        };
        this.projectService.editProject(formattedResult, id).subscribe({
          next: (response) => {
            console.log('project updated successfully:', response);
            this.snackBar.open('Project updated successfully!', 'Dismiss', {
              panelClass: ['success-snackbar'],
            });
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('error updating project:', error);
            this.snackBar.open('Error updating project!', 'Dismiss', {
              panelClass: ['error-snackbar'],
            });
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
        });
      }
    });
  }

  deleteProject(id: number) {
    const dialogRef = this.dialog.open(ProjectDeleteConfirmationComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.deleteProject(id).subscribe({
          next: (response) => {
            console.log('project deleted successfully:', response);
            this.snackBar.open('Project deleted successfully!', 'Dismiss', {
              panelClass: ['success-snackbar'],
            });
          },
          error: (error) => {
            console.error('error deleting project:', error);
            this.snackBar.open('Error deleting project!', 'Dismiss', {
              panelClass: ['error-snackbar'],
            });
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          complete: () => {
            this.router.navigate(['/projects']);
          },
        });
      }
    });
  }

  getTasks(id: number) {
    this.taskService.getTasksByProjectId(id).subscribe({
      next: (response: any) => {
        this.taskList = response.map((task: Task) => ({
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

        this.taskDataSource = new MatTableDataSource<Task>(this.taskList);
        console.log(this.taskDataSource);
      },
      error: (err) => {
        this.snackBar.open("Couldn't get tasks!", 'Dismiss', {
          panelClass: ['error-snackbar'],
        });
        console.error(err);
        throw err;
      },
      complete: () => {
        console.log('complete');
        this.taskDataSource.paginator = this.paginator;
        this.taskDataSource.sort = this.sort;
        this.setupFilterPredicate();
        this.setupSorting();
      },
    });
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.taskDataSource.filter = searchValue.trim().toLowerCase();
  }

  applyFilters(): void {
    this.taskDataSource.filter = JSON.stringify(this.filterValues); // Trigger filtering
  }

  resetFilters(): void {
    this.filterValues = {}; // Reset all filter values
    this.applyFilters(); // Reapply empty filters to reset table
  }

  setupFilterPredicate(): void {
    this.taskDataSource.filterPredicate = (
      data: Task,
      filter: string
    ): boolean => {
      const searchValues = JSON.parse(filter); // Parse filter values

      return Object.keys(searchValues).every((field) => {
        if (!searchValues[field]) return true; // Skip empty filters

        let fieldValue: string = '';

        // Responsible User Filter
        if (field === 'responsible_user' && data.responsible_user) {
          fieldValue = data.responsible_user.name || '';
          return fieldValue
            .toLowerCase()
            .includes(searchValues[field].toLowerCase());
        }

        // Status Filter (Exact Match)
        if (field === 'status' && data.status) {
          return (
            data.status.toLowerCase() === searchValues[field].toLowerCase()
          );
        }

        // Description Filter (Partial Match)
        if (field === 'description' && data.description) {
          return data.description
            .toLowerCase()
            .includes(searchValues[field].toLowerCase());
        }

        // Task Name Filter
        if (field === 'name' && data.name) {
          return data.name
            .toLowerCase()
            .includes(searchValues[field].toLowerCase());
        }

        // Convert task dates to timestamps
        const taskStartDate = data.start_date
          ? new Date(data.start_date).getTime()
          : null;
        const taskEndDate = data.end_date
          ? new Date(data.end_date).getTime()
          : null;

        // Convert filter dates to timestamps
        const filterStartDate = searchValues.startDate
          ? new Date(searchValues.startDate).getTime()
          : null;
        const filterEndDate = searchValues.endDate
          ? new Date(searchValues.endDate).getTime()
          : null;

        // ✅ Keep task visible if:
        // - Its start date is within the filter range
        // - OR its end date is within the filter range
        if (
          (filterStartDate || filterEndDate) &&
          (taskStartDate || taskEndDate)
        ) {
          return (
            (taskStartDate &&
              filterStartDate &&
              taskStartDate >= filterStartDate &&
              (!filterEndDate || taskStartDate <= filterEndDate)) ||
            (taskEndDate &&
              filterStartDate &&
              taskEndDate >= filterStartDate &&
              (!filterEndDate || taskEndDate <= filterEndDate))
          );
        }

        return true; // Default case (no filter applied)
      });
    };
  }

  setupSorting() {
    this.taskDataSource.sortingDataAccessor = (
      item: Task,
      property: string
    ): string | number => {
      if (
        property === 'start_date' ||
        property === 'end_date' ||
        property === 'creation_date'
      ) {
        return item[property as keyof Task]
          ? new Date(item[property as keyof Task] as string).getTime()
          : 0;
      }

      if (property === 'responsible_user') {
        return item.responsible_user?.name?.toLowerCase() ?? '';
      }

      const value = item[property as keyof Task];

      if (typeof value === 'string') {
        return value.toLowerCase(); // Normalize all strings to lowercase for sorting
      }

      return typeof value === 'number' || typeof value === 'string'
        ? value
        : '';
    };
  }

  createTask() {
    const dialogRef = this.dialog.open(TaskCreationFormComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formattedResult: TaskCreationRequest = {
          project_id: result.project,
          name: result.name,
          description: result.description,
          start_date: format(result.start_date, 'dd/MM/yyyy'),
          end_date: format(result.end_date, 'dd/MM/yyyy'),
          status: result.status,
          user_id: result.responsible_user,
        };

        this.taskService.createTask(formattedResult).subscribe({
          next: (response) => {
            console.log('Task created successfully:', response);
            this.snackBar.open('Task created successfully!', 'Dismiss', {
              panelClass: ['success-snackbar'],
            });
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('Error creating task:', error);
            this.snackBar.open('Error creating task!', 'Dismiss', {
              panelClass: ['error-snackbar'],
            });
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
        });
      }
    });
  }

  editTask(id: number) {
    const dialogRef = this.dialog.open(TaskEditingFormComponent, {
      width: '600px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formattedResult: TaskCreationRequest = {
          project_id: result.project,
          name: result.name,
          description: result.description,
          start_date: format(result.start_date, 'dd/MM/yyyy'),
          end_date: format(result.end_date, 'dd/MM/yyyy'),
          status: result.status,
          user_id: result.responsible_user,
        };

        this.taskService.editTask(formattedResult, id).subscribe({
          next: (response) => {
            console.log('Task updated successfully:', response);
            this.snackBar.open('Task updated successfully!', 'Dismiss', {
              panelClass: ['success-snackbar'],
            });
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('Error updating task:', error);
            this.snackBar.open('Error updating task!', 'Dismiss', {
              panelClass: ['error-snackbar'],
            });
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
        });
      }
    });
  }

  deleteTask(id: number) {
    const dialogRef = this.dialog.open(TaskDeleteConfirmationComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.deleteTask(id).subscribe({
          next: (response) => {
            console.log('task deleted successfully:', response);
            this.snackBar.open('Task deleted successfully!', 'Dismiss', {
              panelClass: ['success-snackbar'],
            });
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('error deleting task:', error);
            this.snackBar.open('Error deleting task!', 'Dismiss', {
              panelClass: ['error-snackbar'],
            });
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
        });
      }
    });
  }
}
