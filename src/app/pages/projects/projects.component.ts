import { DateService } from './../../services/date.service';
import {
  ChangeDetectorRef,
  Component,
  inject,
  NgZone,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ProjectService } from '../../services/project/project.service';
import { Project } from '../../models/project/project.type';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectCreationFormComponent } from '../../components/project-creation-form/project-creation-form.component';
import { ProjectCreationRequest } from '../../models/project/projectCreationRequest.type';
import { format } from 'date-fns';

@Component({
  selector: 'app-projects',
  imports: [MatTableModule, MatButtonModule, CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  cdr = inject(ChangeDetectorRef);
  dialog = inject(MatDialog);
  router = inject(Router);
  projectService = inject(ProjectService);
  dateService = inject(DateService);
  ngZone = inject(NgZone);

  projectList: Array<Project> = [];

  // MatTable
  displayedColumns: string[] = [
    'id',
    'name',
    'start_date',
    'end_date',
    'status',
    'priority',
    'responsible_user',
    'actions',
  ];

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe((res: any) => {
      this.projectList = res.map((project: Project) => ({
        ...project,
        start_date: this.dateService.parseDate(
          project.start_date,
          'dd/MM/yyyy'
        ),
        end_date: this.dateService.parseDate(project.end_date, 'dd/MM/yyyy'),
        creation_date: this.dateService.parseDate(
          project.creation_date,
          'dd/MM/yyyy HH:mm:ss'
        ),
        responsible_user: {
          ...project.responsible_user,
          creation_date: this.dateService.parseDate(
            project.responsible_user.creation_date,
            'dd/MM/yyyy HH:mm:ss'
          ),
          last_login: project.responsible_user.last_login
            ? this.dateService.parseDate(
                project.responsible_user.last_login,
                'dd/MM/yyyy HH:mm:ss'
              )
            : null,
        },
      }));
    });
  }

  createProject() {
    const dialogRef = this.dialog.open(ProjectCreationFormComponent, {
      width: '600px',
    });

    // dialogRef.afterOpened().subscribe(() => {
    //   this.cdr.detectChanges(); // Manually trigger change detection
    // });

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
        this.projectService.createProject(formattedResult).subscribe({
          next: (response) => {
            console.log('project created successfully:', response);
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('error creating project:', error);
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
        });
      }
    });
  }

  viewProject(id: number) {
    this.router.navigate(['/projects', id]);
  }
}
