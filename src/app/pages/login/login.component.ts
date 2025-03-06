import { LoginRequest } from './../../models/user/loginRequest.type';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userService = inject(UserService);
  router = inject(Router);

  loginObj: LoginRequest = {
    login: '',
    password: '',
  };

  onLogin() {
    console.log(this.loginObj);
    this.userService
      .login(this.loginObj)
      .pipe(
        catchError((err) => {
          console.log(err);
          alert('Login failed!');
          throw err;
        })
      )
      .subscribe((res: any) => {
        console.log('res: ' + res);
        if (res.token) {
          alert('Welcome ' + res.name);
          localStorage.setItem('Token', res.token);
          this.router.navigateByUrl('dashboard');
        }
      });
  }
}
