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
import { ProjectService } from '../../services/project/project.service';
import { TaskService } from '../../services/task/task.service';
import { DateService } from '../../services/date.service';
import { Task } from '../../models/task/task.type';
import { TaskDeleteConfirmationComponent } from '../../components/task/task-delete-confirmation/task-delete-confirmation.component';
import { format } from 'date-fns';
import { TaskCreationRequest } from '../../models/task/taskCreationRequest.type';
import { MatIconModule } from '@angular/material/icon';
import { TaskCreationFormComponent } from '../../components/task/task-creation-form/task-creation-form.component';
import { TaskEditingFormComponent } from '../../components/task/task-editing-form/task-editing-form.component';

@Component({
  selector: 'app-tasks',
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
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  dialog = inject(MatDialog);
  ngZone = inject(NgZone);
  projectService = inject(ProjectService);
  taskService = inject(TaskService);
  dateService = inject(DateService);

  //MatTable
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'project',
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
    { label: 'Project', value: 'project' },
    { label: 'Responsible User', value: 'responsible_user.name' },
    { label: 'Start Date', value: 'start_date' },
    { label: 'End Date', value: 'end_date' },
    { label: 'Status', value: 'status' },
    { label: 'Creation Date', value: 'creation_date' },
  ];

  taskList: Array<Task> = [];
  taskDataSource = new MatTableDataSource<Task>();

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks().subscribe({
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
      } else if (property === 'project') {
        return item.project?.name?.toLowerCase() ?? '';
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
