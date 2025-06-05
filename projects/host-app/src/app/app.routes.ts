import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { NotFoundComponent } from './not-found.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'contacts',
    canActivate: [AuthGuard],
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        exposedModule: './ContactsModule',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
      }).then((m) => m.default),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        exposedModule: './AdminModule',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
      }).then((m) => m.default),
  },
  {
    path: 'login',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        exposedModule: './LoginModule',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
      }).then((m) => m.default),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
