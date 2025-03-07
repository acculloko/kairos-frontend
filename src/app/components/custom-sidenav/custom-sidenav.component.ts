import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

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
export class CustomSidenavComponent {
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
      route: 'timelog',
    },
  ]);
}
