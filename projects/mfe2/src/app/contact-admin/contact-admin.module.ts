// projects/mfe2/src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ContactAdminComponent } from './contact-admin.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    ContactAdminComponent,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  exports: [ContactAdminComponent],
})
export class AdminModule {}
