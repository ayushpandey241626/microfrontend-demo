import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mfe2Component } from './mfe2.component';
import { Mfe2RoutingModule } from './mfe2-routing.module';

@NgModule({
  imports: [CommonModule, Mfe2RoutingModule, Mfe2Component],
  exports: [Mfe2Component],
})
export class Mfe2Module {}
