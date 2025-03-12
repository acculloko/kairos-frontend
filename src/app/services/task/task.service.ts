import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task/task.type';
import { TaskCreationRequest } from '../../models/task/taskCreationRequest.type';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  API_URL = environment.API_URL;
  http = inject(HttpClient);

  getTasks() {
    return this.http.get<Array<Task>>(`${this.API_URL}/task`);
  }

  getTaskById(id: number) {
    return this.http.get<Task>(`${this.API_URL}/task/${id}`);
  }

  getTasksByProjectId(id: number) {
    return this.http.get<Array<Task>>(`${this.API_URL}/task/project/${id}`);
  }

  getTasksByUserId(id: number) {
    return this.http.get<Array<Task>>(`${this.API_URL}/task/user/${id}`);
  }

  getOverdueTasks() {
    return this.http.get<Array<Task>>(`${this.API_URL}/task/overdue`);
  }

  getUpcomingTasks(id: number | string) {
    return this.http.get<Array<Task>>(`${this.API_URL}/task/active/${id}`);
  }

  getTotalActiveTasks() {
    return this.http.get<number>(`${this.API_URL}/task/active/total`);
  }

  getTotalActiveTasksByUser(id: string) {
    return this.http.get<number>(
      `${this.API_URL}/task/active/total/user/${id}`
    );
  }

  getTaskStatusCountByProjectId(id: number | string) {
    return this.http.get<any>(`${this.API_URL}/task/count-by-status/${id}`);
  }

  createTask(taskCreationRequest: TaskCreationRequest) {
    return this.http.post<Task>(`${this.API_URL}/task`, taskCreationRequest);
  }

  editTask(taskCreationRequest: TaskCreationRequest, id: number) {
    return this.http.put<Task>(
      `${this.API_URL}/task/${id}`,
      taskCreationRequest
    );
  }

  deleteTask(id: number) {
    return this.http.delete<Task>(`${this.API_URL}/task/${id}`);
  }
}
