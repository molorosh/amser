import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/tasks-page/tasks-page').then((m) => m.TasksPage),
  },
  {
    path: 'sprints',
    loadComponent: () =>
      import('./sprints/sprints-page/sprints-page').then((m) => m.SprintsPage),
  },
  {
    path: 'actions',
    loadComponent: () =>
      import('./actions/actions-page/actions-page').then((m) => m.ActionsPage),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-page/admin-page').then((m) => m.AdminPage),
  },
];
