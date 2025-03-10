import { TaskService } from './../../services/task/task.service';
import { DateService } from './../../services/date.service';
import { ProjectService } from './../../services/project/project.service';
import { Component, inject, NgZone, OnInit } from '@angular/core';
import { Project } from '../../models/project/project.type';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task/task.type';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ProjectEditingFormComponent } from '../project-editing-form/project-editing-form.component';
import { ProjectCreationRequest } from '../../models/project/projectCreationRequest.type';
import { format } from 'date-fns';
import { ProjectDeleteConfirmationComponent } from '../project-delete-confirmation/project-delete-confirmation.component';

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
  taskList: Array<Task> = [];

  //MatTable
  displayedColumns: string[] = [
    'id',
    'name',
    'responsible_user',
    'start_date',
    'end_date',
    'status',
    'creation_date',
    'actions',
  ];

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

  getTasks(id: number) {
    this.taskService.getTasksByProjectId(id).subscribe((res: any) => {
      this.taskList = res.map((task: Task) => ({
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
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
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

  editTask(id: number) {
    return null;
  }

  deleteTask(id: number) {
    return null;
  }
}
