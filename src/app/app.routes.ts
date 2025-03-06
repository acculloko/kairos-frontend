import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => {
      return import('./pages/login/login.component').then(
        (m) => m.LoginComponent
      );
    },
  },
  {
    path: '',
    loadComponent: () => {
      return import('./pages/layout/layout.component').then(
        (m) => m.LayoutComponent
      );
    },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => {
          return import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          );
        },
      },
    ],
  },
];
