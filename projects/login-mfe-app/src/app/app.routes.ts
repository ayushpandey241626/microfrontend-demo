import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login-form.routes').then((m) => m.default),
  },
];
