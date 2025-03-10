import { DateService } from './../../services/date.service';
import {
  ChangeDetectorRef,
  Component,
  inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProjectService } from '../../services/project/project.service';
import { Project } from '../../models/project/project.type';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectCreationFormComponent } from '../../components/project-creation-form/project-creation-form.component';
import { ProjectCreationRequest } from '../../models/project/projectCreationRequest.type';
import { format } from 'date-fns';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects',
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

  // MatTable
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

  selectedFilterField: string = 'name';
  filterableFields = [
    { label: 'Id', value: 'id' },
    { label: 'Name', value: 'name' },
    { label: 'Start Date', value: 'start_date' },
    { label: 'End Date', value: 'end_date' },
    { label: 'Status', value: 'status' },
    { label: 'Priority', value: 'priority' },
    { label: 'Responsible User', value: 'responsible_user.name' },
  ];

  projectList: Array<Project> = [];
  projectDataSource = new MatTableDataSource<Project>();

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe({
      next: (response: any) => {
        this.projectList = response.map((project: Project) => ({
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

        this.projectDataSource = new MatTableDataSource<Project>(
          this.projectList
        );
        console.log(this.projectDataSource);
      },
      error: (err) => {
        console.error(err);
        throw err;
      },
      complete: () => {
        console.log('complete');
        this.projectDataSource.paginator = this.paginator;
        this.projectDataSource.sort = this.sort;
        this.setupFilterPredicate();
        this.setupSorting();
      },
    });
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.projectDataSource.filter = searchValue.trim().toLowerCase();
  }

  setupFilterPredicate() {
    this.projectDataSource.filterPredicate = (
      data: Project,
      filter: string
    ) => {
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
    const priorityOrder: Record<string, number> = {
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3,
    };

    this.projectDataSource.sortingDataAccessor = (
      item: Project,
      property: string
    ): string | number => {
      if (property === 'priority') {
        return priorityOrder[item.priority] ?? 999; // Default large number if priority is unknown
      }

      if (property === 'start_date' || property === 'end_date') {
        return item[property as keyof Project]
          ? new Date(item[property as keyof Project] as string).getTime()
          : 0;
      }

      if (property === 'responsible_user') {
        return item.responsible_user?.name?.toLowerCase() ?? '';
      }

      const value = item[property as keyof Project];

      return typeof value === 'number' || typeof value === 'string'
        ? value
        : '';
    };
  }

  createProject() {
    const dialogRef = this.dialog.open(ProjectCreationFormComponent, {
      width: '600px',
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
