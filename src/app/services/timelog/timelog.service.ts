import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Timelog } from '../../models/timelog/timelog.type';
import { TimelogCreationRequest } from '../../models/timelog/timelogCreationRequest.type';

@Injectable({
  providedIn: 'root',
})
export class TimelogService {
  API_URL = environment.API_URL;
  http = inject(HttpClient);

  getLogs() {
    return this.http.get<Array<Timelog>>(`${this.API_URL}/timelog`);
  }

  getLogById(id: number) {
    return this.http.get<Timelog>(`${this.API_URL}/timelog/${id}`);
  }

  logTime(timelogCreationRequest: TimelogCreationRequest) {
    return this.http.post<Timelog>(
      `${this.API_URL}/timelog`,
      timelogCreationRequest
    );
  }

  editLog(timelogCreationRequest: TimelogCreationRequest, id: number) {
    return this.http.put<Timelog>(
      `${this.API_URL}/timelog/${id}`,
      timelogCreationRequest
    );
  }

  deleteLog(id: number) {
    return this.http.delete<Timelog>(`${this.API_URL}/timelog/${id}`);
  }
}
