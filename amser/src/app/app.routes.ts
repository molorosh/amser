import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home-page/home-page').then((m) => m.HomePage),
  },
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
    path: 'about',
    loadComponent: () =>
      import('./about/about-page/about-page').then((m) => m.AboutPage),
  },
  {
    path: 'genz-settings',
    loadComponent: () =>
      import('./genz-settings/genz-settings-page/genz-settings-page').then((m) => m.GenzSettingsPage),
  },
  {
    path: 'data',
    loadComponent: () =>
      import('./data/data-page/data-page').then((m) => m.DataPage),
  },
  {
    path: 'on-this-day',
    loadComponent: () =>
      import('./on-this-day/on-this-day-page/on-this-day-page').then((m) => m.OnThisDayPage),
  },
];
