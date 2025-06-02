// projects/mfe1/src/app/contacts/contacts.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ContactListComponent } from './contact-list.component';
// import { ContactService } from './contact.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ContactListComponent,
  ],
  // providers: [ContactService],
})
export class ContactsModule {}
