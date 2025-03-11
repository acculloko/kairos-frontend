import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};

@Component({
  selector: 'app-custom-sidenav',
  imports: [RouterModule, MatIconModule, MatListModule],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss',
})
export class CustomSidenavComponent implements OnInit {
  authService = inject(AuthService);

  name: string = this.authService.getUserInfo()?.name ?? '';
  role: string = this.authService.getUserInfo()?.role ?? '';

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
}
