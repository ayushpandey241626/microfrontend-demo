import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mfe1Component } from './mfe1.component';
import { Mfe1RoutingModule } from './mfe1-routing.module';

@NgModule({
  imports: [CommonModule, Mfe1RoutingModule, Mfe1Component],
  exports: [Mfe1Component],
})
export class Mfe1Module {}
