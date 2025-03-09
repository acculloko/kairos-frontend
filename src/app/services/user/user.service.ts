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

  getUserById(id: number) {
    return this.http.get<User>(`${this.API_URL}/user/${id}`);
  }

  createUser(registerRequest: RegisterRequest) {
    console.log('creating user');
    return this.http.post<User>(`${this.API_URL}/user`, registerRequest);
  }

  editUser(registerRequest: RegisterRequest, id: number) {
    console.log('editing user');
    return this.http.put<User>(`${this.API_URL}/user/${id}`, registerRequest);
  }

  deleteUser(id: number) {
    console.log('deleting user');
    return this.http.delete<User>(`${this.API_URL}/user/${id}`);
  }
}
