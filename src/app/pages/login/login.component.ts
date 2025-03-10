import { AuthService } from './../../services/auth/auth.service';
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
  authService = inject(AuthService);
  router = inject(Router);

  loginObj: LoginRequest = {
    login: '',
    password: '',
  };

  onLogin() {
    // removes token so that every login gets a new token
    localStorage.removeItem('Token');
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
        if (res.token) {
          localStorage.setItem('Token', res.token);
          alert('Welcome ' + this.authService.getUserInfo()?.name);
          this.router.navigateByUrl('dashboard');
        }
      });
  }
}
