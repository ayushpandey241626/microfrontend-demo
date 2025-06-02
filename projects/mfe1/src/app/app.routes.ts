import { Routes } from '@angular/router';

export const routes: Routes = [
  //{ path: '', redirectTo: 'contacts', pathMatch: 'full' },
  {
    path: 'contacts',
    loadChildren: () =>
      import('./contact-list/contact-list.routes').then((m) => m.default),
  },
];
