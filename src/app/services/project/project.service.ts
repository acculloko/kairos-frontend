import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/project/project.type';
import { ProjectCreationRequest } from '../../models/project/projectCreationRequest.type';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  API_URL = environment.API_URL;
  http = inject(HttpClient);

  getProjects() {
    return this.http.get<Array<Project>>(`${this.API_URL}/project`);
  }

  getProjectById(id: number) {
    return this.http.get<Project>(`${this.API_URL}/project/${id}`);
  }

  createProject(projectCreationRequest: ProjectCreationRequest) {
    return this.http.post<Project>(
      `${this.API_URL}/project`,
      projectCreationRequest
    );
  }
}
