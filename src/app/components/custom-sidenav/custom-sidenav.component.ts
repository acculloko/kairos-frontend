import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};

@Component({
  selector: 'app-custom-sidenav',
  imports: [RouterModule, MatIconModule, MatListModule, MatButtonModule],
  templateUrl: './custom-sidenav.component.html',
  styleUrls: ['./custom-sidenav.component.scss', '../../../styles.scss'],
})
export class CustomSidenavComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  name: string = this.authService.getUserInfo()?.name ?? '';
  role: string = this.authService.getUserInfo()?.role ?? '';

  logoPath: string =
    '../../../assets/kairos-high-resolution-logo-transparent-cropped.svg';

  menuItems = signal<MenuItem[]>([
    {
      icon: 'speed',
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      icon: 'group',
      label: 'Users',
      route: 'users',
    },
    {
      icon: 'description',
      label: 'Projects',
      route: 'projects',
    },
    {
      icon: 'task_alt',
      label: 'Tasks',
      route: 'tasks',
    },
    {
      icon: 'hourglass_empty',
      label: 'Time Logger',
      route: 'timelogger',
    },
  ]);

  ngOnInit(): void {
    // const currentTheme = this.detectSystemTheme();
    // console.log('Detected theme:', currentTheme);
    // if (currentTheme === 'dark') {
    //   this.logoPath =
    //     '../../../assets/kairos-high-resolution-logo-transparent-dark-mode-cropped.svg';
    // } else {
    //   this.logoPath =
    //     '../../../assets/kairos-high-resolution-logo-transparent-cropped.svg';
    // }

    if (this.role != 'ADMIN') {
      this.menuItems = signal<MenuItem[]>([
        {
          icon: 'speed',
          label: 'Dashboard',
          route: 'dashboard',
        },
        {
          icon: 'description',
          label: 'Projects',
          route: 'projects',
        },
        {
          icon: 'task_alt',
          label: 'Tasks',
          route: 'tasks',
        },
        {
          icon: 'hourglass_empty',
          label: 'Time Logger',
          route: 'timelogger',
        },
      ]);
    }
  }

  logout() {
    this.router.navigate(['']);
    localStorage.removeItem('Token');
  }

  detectSystemTheme(): string {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
