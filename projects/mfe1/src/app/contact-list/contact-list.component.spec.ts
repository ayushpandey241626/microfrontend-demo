import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
    component.ngOnInit();
    expect(component.contacts.length).toBeGreaterThan(0);
    expect(component.groupOptions.length).toBeGreaterThan(0);
    expect(component.tagOptions.length).toBeGreaterThan(0);
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

  it('onSelectNameSuggestion should set nameControl value and apply filters', () => {
    spyOn(component, 'applyAllFilters');
    component.onSelectNameSuggestion('Alice');
    expect(component.nameControl.value).toBe('Alice');
    expect(component.applyAllFilters).toHaveBeenCalled();
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

  it('filteredGroupOptions should return group options without null', () => {
    component.groupOptions = [
      { label: 'All Groups', value: null },
      { label: 'Friends', value: 'Friends' },
    ];
    const filtered = component.filteredGroupOptions();
    expect(filtered.some((g) => g.value === null)).toBeFalse();
    expect(filtered.some((g) => g.value === 'Friends')).toBeTrue();
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

  it('onRowEditSave should validate and save row', () => {
    const row = {
      id: 1,
      name: 'A',
      email: 'a@a.com',
      phone: '1',
      group: 'G',
      tags: [],
      dateAdded: new Date(),
    };
    component.editingRows[row.id] = true;
    component.originalRowData[row.id] = { ...row };
    spyOn(messageService, 'add');
    spyOn(component, 'applyAllFilters');
    component.onRowEditSave(row);
    expect(component.editingRows[row.id]).toBeFalse();
    expect(component.applyAllFilters).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'success' })
    );
  });

  it('onRowEditSave should show error if required fields missing', () => {
    const row = {
      id: 1,
      name: '',
      email: '',
      phone: '',
      group: '',
      tags: [],
      dateAdded: undefined as any,
    };
    spyOn(messageService, 'add');
    component.onRowEditSave(row);
    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error' })
    );
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

  it('onDeleteContact should confirm and delete contact', fakeAsync(() => {
    const row = {
      id: 1,
      name: 'A',
      email: '',
      phone: '',
      group: '',
      tags: [],
      dateAdded: new Date(),
    };
    component.contacts = [row];
    spyOn(confirmationService, 'confirm').and.callFake((opts: Confirmation) => {
      setTimeout(() => {
        opts.accept && opts.accept();
      }, 0);
      return undefined as any;
    });
    spyOn(messageService, 'add');
    component.onDeleteContact(row);
    tick(); // Fast-forward the setTimeout
    fixture.detectChanges(); // Ensure Angular processes changes
    expect(component.contacts.length).toBe(0);
    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'success' })
    );
  }));
});
