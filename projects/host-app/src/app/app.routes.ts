import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  /*  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full',
  }, */
  {
    path: 'contacts',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        exposedModule: './ContactsModule',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
      }).then((m) => m.default),
  },
  // {
  //   path: 'admin',
  //   loadChildren: () => {
  //     return loadRemoteModule({
  //       remoteName: 'mfe2',
  //       exposedModule: './AdminModule',
  //       remoteEntry: 'http://localhost:4202/remoteEntry.js',
  //     }).then((m) => m.AdminModule);
  //   },
  // },
  // {
  //   path: 'mfe1',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       type: 'module',
  //       remoteEntry: 'http://localhost:4201/remoteEntry.js',
  //       exposedModule: './Module',
  //     }).then((m) => m.Mfe1Module),
  // },
  // {
  //   path: 'mfe2',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       type: 'module',
  //       remoteEntry: 'http://localhost:4202/remoteEntry.js',
  //       exposedModule: './Module',
  //     }).then((m) => m.Mfe2Module),
  // },
];
