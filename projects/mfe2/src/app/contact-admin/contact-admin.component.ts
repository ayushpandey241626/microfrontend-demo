import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-contact-admin',
  imports: [FormsModule, ButtonModule],
  templateUrl: './contact-admin.component.html',
  styleUrl: './contact-admin.component.css',
  providers: [MessageService],
})
export class ContactAdminComponent {
  newContact = { name: '', email: '' };

  constructor(private messageService: MessageService) {}

  addContact() {
    // Implement actual API call here
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Contact added successfully!',
    });
    this.newContact = { name: '', email: '' };
  }
}
