// projects/mfe1/src/app/contact.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private contacts = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  getContacts() {
    return [...this.contacts];
  }

  addContact(contact: any) {
    this.contacts.push({ ...contact, id: this.contacts.length + 1 });
  }

  deleteContact(id: number) {
    this.contacts = this.contacts.filter((c) => c.id !== id);
  }
}
