import { RegisterRequest } from './../../models/user/registerRequest.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../../models/user/loginRequest.type';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../models/user/loginResponse.type';
import { User } from '../../models/user/user.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  API_URL = environment.API_URL;
  http = inject(HttpClient);

  login(loginRequest: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${this.API_URL}/auth/login`,
      loginRequest
    );
  }

  getUsers() {
    return this.http.get<Array<User>>(`${this.API_URL}/user`);
  }

  createUser(registerRequest: RegisterRequest) {
    console.log('creating user');
    return this.http.post<User>(`http://localhost:8080/user`, registerRequest);
  }
}
