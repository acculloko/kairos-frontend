import { TaskService } from './../../services/task/task.service';
import { DateService } from './../../services/date.service';
import { ProjectService } from './../../services/project/project.service';
import { Component, inject, OnInit } from '@angular/core';
import { Project } from '../../models/project/project.type';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task/task.type';

@Component({
  selector: 'app-project-details',
  imports: [MatTableModule, MatButtonModule, CommonModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
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

  editTask(id: number) {
    return null;
  }

  deleteTask(id: number) {
    return null;
  }
}
