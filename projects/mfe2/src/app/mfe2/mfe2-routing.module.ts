import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Mfe2Component } from './mfe2.component';

const routes: Routes = [{ path: '', component: Mfe2Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Mfe2RoutingModule {}
