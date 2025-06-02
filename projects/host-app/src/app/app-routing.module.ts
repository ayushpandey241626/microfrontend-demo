import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/contacts',
    pathMatch: 'full',
  },
  {
    path: 'contacts',
    loadChildren: () => {
      return loadRemoteModule({
        remoteName: 'mfe1',
        exposedModule: './ContactsModule',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
      }).then((m) => m.ContactsModule);
    },
  },
  {
    path: 'admin',
    loadChildren: () => {
      return loadRemoteModule({
        remoteName: 'mfe2',
        exposedModule: './AdminModule',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
      }).then((m) => m.AdminModule);
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
