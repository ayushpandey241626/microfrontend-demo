import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./contact-admin/contact-admin.routes').then((m) => m.default),
  },
];
