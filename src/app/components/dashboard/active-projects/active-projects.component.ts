import { Project } from './../../../models/project/project.type';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '../../../services/project/project.service';
import { TaskService } from '../../../services/task/task.service';
import { Observable, switchMap } from 'rxjs';
import { TaskStatusCount } from '../../../models/task/taskStatusCount.type';

Chart.register(...registerables);

@Component({
  selector: 'app-active-projects',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './active-projects.component.html',
  styleUrl: './active-projects.component.scss',
})
export class ActiveProjectsComponent implements OnInit {
  projectService = inject(ProjectService);
  taskService = inject(TaskService);
  cdr = inject(ChangeDetectorRef);

  form: FormGroup;

  projects: any[] = [];
  filteredProjects: any[] = [];

  firstProject: Project | null = null;

  selectedProjectName: string = '';
  selectedProjectId: number | string = '';

  isFirstLoad = true;
  totalProjects = 0;

  // Chart.js
  @ViewChild('myChart', { static: true }) chartRef!: ElementRef;
  chart!: Chart;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      project: [{ value: this.selectedProjectName }, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.isFirstLoad) {
      this.projectService.getActiveProjects().subscribe(
        (projects) => {
          if (projects.length > 0) {
            this.firstProject = projects[0];

            this.totalProjects = projects.length;
            this.selectedProjectName = this.firstProject.name;
            this.selectedProjectId = this.firstProject.id;

            this.fetchChartData(this.firstProject.id).subscribe((data) => {
              this.createChart(data);
            });

            this.form.patchValue({
              project: this.selectedProjectName,
            });
            this.cdr.detectChanges();
          }
        },
        (error) => {
          console.error('Error fetching active projects:', error);
        }
      );
    }
  }

  getProjects() {
    const query = this.form.get('project')?.value;
    if (query.length > 0) {
      this.projectService.getActiveProjects().subscribe((projects) => {
        this.projects = projects;
        this.filteredProjects = this.projects.filter((project) =>
          project.name.toLowerCase().includes(query.toLowerCase())
        );
      });
    }
  }

  selectProject(project: any): void {
    this.selectedProjectId = project.id;

    this.fetchChartData(project.id).subscribe((data) => {
      this.updateChart(data);
    });
  }

  createEmptyChart(): void {
    const ctx = this.chartRef.nativeElement as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar' as ChartType,
      data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
          {
            label: 'Data',
            data: [0, 0, 0, 0, 0], // Placeholder values
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  createChart(initialData: number[]): void {
    const ctx = this.chartRef.nativeElement as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'doughnut' as ChartType,
      data: {
        labels: ['DONE', 'ONGOING', 'OPEN', 'PAUSED', 'CANCELLED'],
        datasets: [
          {
            label: 'Task Status Count',
            data: initialData,
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
      },
    });
  }

  fetchChartData(id: number): Observable<number[]> {
    return this.taskService.getTaskStatusCountByProjectId(id).pipe(
      switchMap((response) => {
        return [this.normalizeChartData(response.taskCounts)];
      })
    );
  }

  normalizeChartData(taskCounts: TaskStatusCount[]): number[] {
    const statusOrder = ['DONE', 'ONGOING', 'OPEN', 'PAUSED', 'CANCELLED'];
    const statusMap = new Map(
      taskCounts.map((item) => [item.status, item.count])
    );

    return statusOrder.map((status) => statusMap.get(status) || 0);
  }

  updateChart(newData: number[]): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = newData;
      this.chart.update(); // Update the chart with new data
    }
  }
}
