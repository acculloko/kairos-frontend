import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task/task.type';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  API_URL = environment.API_URL;
  http = inject(HttpClient);

  getTasksByProjectId(id: number) {
    return this.http.get<Array<Task>>(`${this.API_URL}/task/project/${id}`);
  }
}
