import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-page/admin-page').then((m) => m.AdminPage),
  },
];
