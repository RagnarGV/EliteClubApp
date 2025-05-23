import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../home/home.page').then((m) => m.HomePage),
          },
        ],
      },
      {
        path: 'waitlist',
        loadComponent: () =>
          import('../waitlist/waitlist.page').then((m) => m.WaitlistPage),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('../schedule/schedule.page').then((m) => m.SchedulePage),
      },
      {
        path: 'special-events',
        loadComponent: () =>
          import('../special-events/special-events.component').then(
            (m) => m.SpecialEventsComponent
          ),
      },
      {
        path: 'f&q',
        loadComponent: () =>
          import('../fandq/fandq.page').then((m) => m.FANDQPage),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
      {
        path: 'toc',
        loadComponent: () => import('../toc/toc.page').then((m) => m.TocPage),
      },
      {
        path: 'pre-reg-toc',
        loadComponent: () =>
          import('../pre-reg-toc/pre-reg-toc.page').then(
            (m) => m.PreRegTOCPage
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
