import { AuthService } from './../../services/auth/auth.service';
import { LoginRequest } from './../../models/user/loginRequest.type';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../styles.scss'],
})
export class LoginComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);

  snackBar = inject(MatSnackBar);

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
          this.snackBar.open('Login failed, try again.', 'Dismiss', {
            panelClass: ['error-snackbar'],
          });
          throw err;
        })
      )
      .subscribe((res: any) => {
        if (res.token) {
          localStorage.setItem('Token', res.token);
          this.snackBar.open(
            'Welcome, ' + this.authService.getUserInfo()?.name + '!',
            '',
            { duration: 3000 }
          );
          this.router.navigateByUrl('dashboard');
        }
      });
  }
}
