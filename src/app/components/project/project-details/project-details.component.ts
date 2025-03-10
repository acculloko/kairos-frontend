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
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialog = inject(MatDialog);
  ngZone = inject(NgZone);
  projectService = inject(ProjectService);
  taskService = inject(TaskService);
  dateService = inject(DateService);

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
    'creation_date',
    'actions',
  ];

  selectedFilterField: string = 'name';
  filterableFields = [
    { label: 'Id', value: 'id' },
    { label: 'Name', value: 'name' },
    { label: 'Description', value: 'description' },
    { label: 'Responsible User', value: 'responsible_user.name' },
    { label: 'Start Date', value: 'start_date' },
    { label: 'End Date', value: 'end_date' },
    { label: 'Status', value: 'status' },
    { label: 'Creation Date', value: 'creation_date' },
  ];

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
        responsible_user: {
          ...res.responsible_user,
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
        },
      };
    });
  }

  editProject(id: number) {
    const dialogRef = this.dialog.open(ProjectEditingFormComponent, {
      width: '600px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
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
            console.log('project edited successfully:', response);
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('error editing project:', error);
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
          },
          error: (error) => {
            console.error('error deleting project:', error);
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

        this.taskDataSource = new MatTableDataSource<Task>(this.taskList);
        console.log(this.taskDataSource);
      },
      error: (err) => {
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

  setupFilterPredicate() {
    this.taskDataSource.filterPredicate = (data: Task, filter: string) => {
      if (!this.selectedFilterField || !filter) return true;

      let fieldValue: string = '';

      if (this.selectedFilterField === 'id') {
        fieldValue = data.id.toString();
      } else if (this.selectedFilterField === 'start_date' && data.start_date) {
        fieldValue =
          this.dateService.formatDate(data.start_date, 'dd/MM/yyyy') || '';
      } else if (this.selectedFilterField === 'end_date' && data.end_date) {
        fieldValue =
          this.dateService.formatDate(data.end_date, 'dd/MM/yyyy') || '';
      } else if (
        this.selectedFilterField === 'creation_date' &&
        data.creation_date
      ) {
        fieldValue =
          this.dateService.formatDate(
            data.creation_date,
            'dd/MM/yyyy HH:mm:ss'
          ) || '';
      } else if (
        this.selectedFilterField === 'responsible_user.name' &&
        data.responsible_user
      ) {
        fieldValue = data.responsible_user.name || '';
      } else {
        fieldValue = (data as any)[this.selectedFilterField] || '';
      }

      return fieldValue.toLowerCase().includes(filter.toLowerCase());
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
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('Error creating task:', error);
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
            console.log('Task created successfully:', response);
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('Error creating task:', error);
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
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('error deleting task:', error);
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
