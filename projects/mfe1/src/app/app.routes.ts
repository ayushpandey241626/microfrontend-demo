import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';

export const routes: Routes = [
  //{ path: '', redirectTo: 'contacts', pathMatch: 'full' },
  {
    path: 'contacts',
    loadChildren: () =>
      import('./contact-list/contact-list.routes').then((m) => m.default),
  },
];
