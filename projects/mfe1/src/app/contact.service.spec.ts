import { TestBed } from '@angular/core/testing';

import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a copy of the contacts array', () => {
    const contacts = service.getContacts();
    expect(contacts).toEqual([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]);
    // Ensure it's a copy, not the original array
    contacts.push({ id: 3, name: 'Fake', email: 'fake@example.com' });
    expect(service.getContacts().length).toBe(2);
  });

  it('should add a new contact with a unique id', () => {
    const newContact = { name: 'Alice', email: 'alice@example.com' };
    service.addContact(newContact);
    const contacts = service.getContacts();
    expect(contacts.length).toBe(3);
    expect(contacts[2]).toEqual(
      jasmine.objectContaining({
        id: 3,
        name: 'Alice',
        email: 'alice@example.com',
      })
    );
  });

  it('should delete a contact by id', () => {
    service.deleteContact(1);
    const contacts = service.getContacts();
    expect(contacts.length).toBe(1);
    expect(contacts[0]).toEqual(
      jasmine.objectContaining({
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
      })
    );
    // Should not contain the deleted contact
    expect(contacts.find((c) => c.id === 1)).toBeUndefined();
  });
});
