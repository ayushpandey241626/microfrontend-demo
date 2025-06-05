import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../contact.service';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContactListComponent,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ContactService, useValue: {} },
        ConfirmationService,
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    confirmationService = TestBed.inject(ConfirmationService);
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should initialize contacts, groupOptions, tagOptions', () => {
    // Clear localStorage to ensure initialContacts are loaded
    localStorage.removeItem('contacts');
    component.ngOnInit();
    expect(component.contacts.length).toBeGreaterThan(0);
    expect(component.groupOptions.length).toBeGreaterThan(0);
    expect(component.tagOptions.length).toBeGreaterThan(0);
  });

  it('ngOnInit should call filterNameSuggestions with empty string on nameControl valueChanges', () => {
    spyOn(component, 'filterNameSuggestions');
    component.ngOnInit();
    // Simulate valueChanges with null (should default to '')
    component.nameControl.setValue(null);
    expect(component.filterNameSuggestions).toHaveBeenCalledWith('');
  });

  it('filterNameSuggestions should filter names', () => {
    component.contacts = [
      {
        id: 1,
        name: 'Alice',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(),
      },
      {
        id: 2,
        name: 'Bob',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(),
      },
    ];
    component.filterNameSuggestions('Ali');
    expect(component.nameSuggestions).toContain('Alice');
    component.filterNameSuggestions('Nonexistent');
    expect(component.nameSuggestions.length).toBe(0);
  });

  it('filterNameSuggestions should handle query object with query property', () => {
    component.contacts = [
      {
        id: 1,
        name: 'Alice',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(),
      },
      {
        id: 2,
        name: 'Bob',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(),
      },
    ];
    component.filterNameSuggestions({ query: 'Bob' });
    expect(component.nameSuggestions).toContain('Bob');
    expect(component.nameSuggestions.length).toBe(1);
  });

  it('filterNameSuggestions should clear suggestions for empty or whitespace search', () => {
    component.contacts = [
      {
        id: 1,
        name: 'Alice',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(),
      },
    ];
    component.filterNameSuggestions('');
    expect(component.nameSuggestions.length).toBe(0);

    component.filterNameSuggestions('   ');
    expect(component.nameSuggestions.length).toBe(0);

    component.filterNameSuggestions({ query: '' });
    expect(component.nameSuggestions.length).toBe(0);

    component.filterNameSuggestions({ query: '   ' });
    expect(component.nameSuggestions.length).toBe(0);
  });

  it('onGroupChange should apply filters', () => {
    spyOn(component, 'applyAllFilters');
    component.onGroupChange();
    expect(component.applyAllFilters).toHaveBeenCalled();
  });

  it('onTagsChange should apply filters', () => {
    spyOn(component, 'applyAllFilters');
    component.onTagsChange();
    expect(component.applyAllFilters).toHaveBeenCalled();
  });

  it('onDateRangeSelect should apply filters', () => {
    spyOn(component, 'applyAllFilters');
    component.onDateRangeSelect();
    expect(component.applyAllFilters).toHaveBeenCalled();
  });

  it('applyAllFilters should filter contacts by group, name, tags, and date', () => {
    component.contacts = [
      {
        id: 1,
        name: 'Alice',
        email: '',
        phone: '',
        group: 'Friends',
        tags: ['VIP'],
        dateAdded: new Date(2025, 0, 1),
      },
      {
        id: 2,
        name: 'Bob',
        email: '',
        phone: '',
        group: 'Family',
        tags: ['Urgent'],
        dateAdded: new Date(2025, 1, 1),
      },
    ];
    component.selectedGroup = 'Friends';
    component.nameControl.setValue('Alice');
    component.selectedTags = ['VIP'];
    component.selectedDateRange = [new Date(2025, 0, 1), new Date(2025, 0, 2)];
    component.applyAllFilters();
    expect(component.filteredContacts.length).toBe(1);
    expect(component.filteredContacts[0].name).toBe('Alice');
  });

  it('applyAllFilters should filter out contacts by name filter', () => {
    component.contacts = [
      {
        id: 1,
        name: 'Alice',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(),
      },
      {
        id: 2,
        name: 'Bob',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(),
      },
    ];
    component.nameControl.setValue('Nonexistent');
    component.applyAllFilters();
    expect(component.filteredContacts.length).toBe(0);
  });

  it('applyAllFilters should filter out contacts by tags filter', () => {
    component.contacts = [
      {
        id: 1,
        name: 'Alice',
        email: '',
        phone: '',
        group: '',
        tags: ['VIP'],
        dateAdded: new Date(),
      },
      {
        id: 2,
        name: 'Bob',
        email: '',
        phone: '',
        group: '',
        tags: ['Urgent'],
        dateAdded: new Date(),
      },
    ];
    component.selectedTags = ['VIP', 'Urgent'];
    component.applyAllFilters();
    expect(component.filteredContacts.length).toBe(0);
  });

  it('applyAllFilters should handle dateAdded as string/number and filter by date range', () => {
    const dateStr = new Date(2025, 0, 1).toISOString();
    const dateNum = new Date(2025, 0, 2).getTime();
    component.contacts = [
      {
        id: 1,
        name: 'Alice',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: dateStr,
      },
      {
        id: 2,
        name: 'Bob',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: dateNum,
      },
      {
        id: 3,
        name: 'Charlie',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(2025, 0, 3),
      },
      {
        id: 4,
        name: 'Invalid',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: {} as any,
      },
    ];
    component.selectedDateRange = [new Date(2025, 0, 1), new Date(2025, 0, 2)];
    component.applyAllFilters();
    // Only Alice and Bob should match, Charlie is out of range, Invalid is filtered out
    expect(component.filteredContacts.length).toBe(2);
    expect(
      component.filteredContacts.some((c) => c.name === 'Alice')
    ).toBeTrue();
    expect(component.filteredContacts.some((c) => c.name === 'Bob')).toBeTrue();
    expect(
      component.filteredContacts.some((c) => c.name === 'Charlie')
    ).toBeFalse();
    expect(
      component.filteredContacts.some((c) => c.name === 'Invalid')
    ).toBeFalse();
  });

  it('onAddContactSubmit should add a new contact and reset dialog', () => {
    component.contacts = [];
    component.groupOptions = [{ label: 'Friends', value: 'Friends' }];
    component.tagOptions = [{ label: 'VIP', value: 'VIP' }];
    component.newContact = {
      name: 'New',
      email: 'new@mail.com',
      phone: '123',
      group: 'NewGroup',
      tags: ['NewTag'],
      dateAdded: new Date(),
    };
    component.onAddContactSubmit();
    expect(component.contacts.length).toBe(1);
    expect(component.showAddContactDialog).toBeFalse();
    expect(component.newContact.name).toBe('');
    expect(
      component.groupOptions.some((g) => g.value === 'NewGroup')
    ).toBeTrue();
    expect(component.tagOptions.some((t) => t.value === 'NewTag')).toBeTrue();
  });

  it('onAddContactSubmit should update an existing contact and trigger contactsSubject', () => {
    // Arrange: Add a contact to edit
    const originalContact = {
      id: 10,
      name: 'Old Name',
      email: 'old@email.com',
      phone: '000',
      group: 'OldGroup',
      tags: ['OldTag'],
      dateAdded: new Date(2025, 1, 1),
    };
    component.contacts = [originalContact];
    component.isEditMode = true;
    component.editContactId = originalContact.id.toString(); // Fix: assign as string
    component.newContact = {
      name: 'Updated Name',
      email: 'updated@email.com',
      phone: '999',
      group: 'NewGroup',
      tags: ['NewTag'],
      dateAdded: new Date(2025, 2, 2),
    };
    // Spy on contactsSubject.next
    spyOn(component['contactsSubject'], 'next').and.callThrough();

    // Act
    component.onAddContactSubmit();

    // Assert
    expect(component.contacts[0].name).toBe('Updated Name');
    expect(component.contacts[0].email).toBe('updated@email.com');
    expect(component.contacts[0].phone).toBe('999');
    expect(component.contacts[0].group).toBe('NewGroup');
    expect(component.contacts[0].tags).toEqual(['NewTag']);
    expect(component.contacts[0].dateAdded).toEqual(new Date(2025, 2, 2));
    expect(component['contactsSubject'].next).toHaveBeenCalledWith([
      component.contacts[0],
    ]);
    expect(component.isEditMode).toBeFalse();
    expect(component.editContactId).toBeNull();
    expect(component.showAddContactDialog).toBeFalse();
  });

  it('onAddContactSubmit should use default values for missing fields when updating', () => {
    const originalContact = {
      id: 20,
      name: 'Old Name',
      email: 'old@email.com',
      phone: '000',
      group: 'OldGroup',
      tags: ['OldTag'],
      dateAdded: new Date(2025, 1, 1),
    };
    component.contacts = [originalContact];
    component.isEditMode = true;
    component.editContactId = originalContact.id.toString();
    // newContact missing some fields
    component.newContact = {
      name: undefined,
      email: undefined,
      phone: undefined,
      group: undefined,
      tags: undefined,
      dateAdded: undefined,
    };
    spyOn(component['contactsSubject'], 'next').and.callThrough();

    component.onAddContactSubmit();

    const updated = component.contacts[0];
    expect(updated.name).toBe('');
    expect(updated.email).toBe('');
    expect(updated.phone).toBe('');
    expect(updated.group).toBe('');
    expect(updated.tags).toEqual([]);
    expect(updated.dateAdded instanceof Date).toBeTrue();
    expect(component['contactsSubject'].next).toHaveBeenCalled();
  });

  it('onAddContactSubmit should use default values for missing fields when adding new contact', () => {
    component.contacts = [];
    component.isEditMode = false;
    component.editContactId = null;
    component.newContact = {
      name: undefined,
      email: undefined,
      phone: undefined,
      group: undefined,
      tags: undefined,
      dateAdded: undefined,
    };
    spyOn(component['contactsSubject'], 'next').and.callThrough();

    component.onAddContactSubmit();

    const added = component.contacts[0];
    expect(added.name).toBe('');
    expect(added.email).toBe('');
    expect(added.phone).toBe('');
    expect(added.group).toBe('');
    expect(added.tags).toEqual([]);
    expect(added.dateAdded instanceof Date).toBeTrue();
    expect(component['contactsSubject'].next).toHaveBeenCalled();
  });

  it('filteredGroupOptions should return group options without null', () => {
    component.groupOptions = [
      { label: 'All Groups', value: null },
      { label: 'Friends', value: 'Friends' },
    ];
    const filtered = component.filteredGroupOptions();
    expect(filtered.some((g) => g.value === null)).toBeFalse();
    expect(filtered.some((g) => g.value === 'Friends')).toBeTrue();
  });

  it('filteredGroupOptions should return empty array if groupOptions is undefined or null', () => {
    (component as any).groupOptions = undefined;
    expect(component.filteredGroupOptions()).toEqual([]);
    (component as any).groupOptions = null;
    expect(component.filteredGroupOptions()).toEqual([]);
  });

  it('onRowEditInit should set editingRows and originalRowData', () => {
    const row = {
      id: 1,
      name: 'A',
      email: '',
      phone: '',
      group: '',
      tags: [],
      dateAdded: new Date(),
    };
    component.onRowEditInit(row);
    expect(component.editingRows[row.id]).toBeTrue();
    expect(component.originalRowData[row.id]).toBeTruthy();
  });

  it('onRowEditCancel should restore original data and stop editing', () => {
    const row = {
      id: 1,
      name: 'A',
      email: '',
      phone: '',
      group: '',
      tags: [],
      dateAdded: new Date(),
    };
    component.originalRowData[row.id] = { ...row, name: 'Original' };
    component.editingRows[row.id] = true;
    component.onRowEditCancel(row, 0);
    expect(row.name).toBe('Original');
    expect(component.editingRows[row.id]).toBeFalse();
    expect(component.originalRowData[row.id]).toBeUndefined();
  });

  it('should set viewContact and showViewDialog to true when onViewContact is called', () => {
    const contact = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      group: 'Test Group',
      tags: ['tag1'],
      dateAdded: new Date(),
    };
    component.onViewContact(contact as any);
    expect(component.viewContact).toEqual(contact);
    expect(component.showViewDialog).toBeTrue();
  });

  it('should open confirmation dialog and delete contact on accept in onDeleteContact', () => {
    const contact = {
      id: 1,
      name: 'Delete Me',
      email: 'delete@example.com',
      phone: '1234567890',
      group: 'Test Group',
      tags: [],
      dateAdded: new Date(),
    };
    component.contacts = [contact];
    spyOn(component['confirmationService'], 'confirm').and.callFake(
      (options: any) => {
        // Simulate user clicking accept
        return options.accept();
      }
    );
    spyOn(component['messageService'], 'add');
    component.onDeleteContact(contact as any);
    expect(component.contacts.length).toBe(0);
    expect(component['messageService'].add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'success',
        summary: 'Contact Deleted',
      })
    );
  });

  it('onRowEditSave should show error if required fields are missing', () => {
    const row = {
      id: 1,
      name: '',
      email: '',
      phone: '',
      group: '',
      tags: [],
      dateAdded: undefined,
    };
    spyOn(component['messageService'], 'add');
    component.onRowEditSave(row as any);
    expect(component['messageService'].add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'error',
        summary: 'Validation Error',
      })
    );
  });

  it('onRowEditSave should save and show success if all fields are valid', () => {
    const row = {
      id: 2,
      name: 'Valid Name',
      email: 'valid@email.com',
      phone: '1234567890',
      group: 'Friends',
      tags: [],
      dateAdded: new Date(),
    };
    component.editingRows[row.id] = true;
    component.originalRowData[row.id] = { ...row };
    spyOn(component['messageService'], 'add');
    spyOn(component, 'applyAllFilters');
    component.onRowEditSave(row as any);
    expect(component.editingRows[row.id]).toBeFalse();
    expect(component.originalRowData[row.id]).toBeUndefined();
    expect(component.applyAllFilters).toHaveBeenCalled();
    expect(component['messageService'].add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'success',
        summary: 'Contact Updated',
      })
    );
  });

  it('onEditContact should set edit mode, editContactId, newContact, and show dialog', () => {
    const contact = {
      id: 5,
      name: 'Edit Me',
      email: 'edit@example.com',
      phone: '555-1234',
      group: 'Friends',
      tags: ['VIP'],
      dateAdded: new Date(),
    };
    component.onEditContact(contact as any);
    expect(component.isEditMode).toBeTrue();
    expect(component.editContactId).toBe(contact.id as any); // Use 'as any' to avoid TS error
    expect(component.newContact).toEqual(contact);
    expect(component.showAddContactDialog).toBeTrue();
  });

  it('openAddContactDialog should reset dialog state and newContact fields', () => {
    // Arrange: Set edit mode and fill fields
    component.isEditMode = true;
    component.editContactId = '123';
    component.newContact = {
      name: 'Should Reset',
      email: 'reset@email.com',
      phone: '000',
      group: 'ResetGroup',
      tags: ['ResetTag'],
      dateAdded: new Date(),
    };
    component.showAddContactDialog = false;

    // Act
    component.openAddContactDialog();

    // Assert
    expect(component.isEditMode).toBeFalse();
    expect(component.editContactId).toBeNull();
    expect(component.showAddContactDialog).toBeTrue();
    expect(component.newContact).toEqual({
      name: '',
      email: '',
      phone: '',
      group: '',
      tags: [],
      dateAdded: undefined,
    });
  });

  it('onSelectNameSuggestion should set nameControl value and apply filters', () => {
    spyOn(component.nameControl, 'setValue');
    spyOn(component, 'applyAllFilters');
    const suggestion = { value: 'Alice' };
    component.onSelectNameSuggestion(suggestion);
    expect(component.nameControl.setValue).toHaveBeenCalledWith('Alice');
    expect(component.applyAllFilters).toHaveBeenCalled();
  });

  it('generateNumericId should return max id + 1 when contacts exist', () => {
    component.contacts = [
      {
        id: 5,
        name: '',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(),
      },
      {
        id: 10,
        name: '',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(),
      },
      {
        id: 7,
        name: '',
        email: '',
        phone: '',
        group: '',
        tags: [],
        dateAdded: new Date(),
      },
    ];
    const newId = component.generateNumericId();
    expect(newId).toBe(11);
  });
});
