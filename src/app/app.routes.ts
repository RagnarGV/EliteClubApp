import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },

  {
    path: 'fandq',
    loadComponent: () => import('./fandq/fandq.page').then((m) => m.FANDQPage),
  },
  {
    path: 'waitlist',
    loadComponent: () =>
      import('./waitlist/waitlist.page').then((m) => m.WaitlistPage),
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./schedule/schedule.page').then((m) => m.SchedulePage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'toc/:id',
    loadComponent: () => import('./toc/toc.page').then((m) => m.TocPage),
  },
  {
    path: 'pre-reg-toc',
    loadComponent: () => import('./pre-reg-toc/pre-reg-toc.page').then( m => m.PreRegTOCPage)
  },
];
