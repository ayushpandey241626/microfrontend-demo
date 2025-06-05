import { Component, OnInit, Inject } from '@angular/core';
import { ContactService } from '../contact.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';
import { FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { SelectModule } from 'primeng/select';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  group: string;
  tags: string[];
  dateAdded: Date;
}
@Component({
  selector: 'app-contact-list',
  imports: [
    TableModule,
    ConfirmDialogModule,
    SelectModule,
    MessageModule,
    ButtonModule,
    DatePickerModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    CalendarModule,
    AutoCompleteModule,
    MultiSelectModule,
    ButtonModule,
    InputTextModule,
    ChipModule,
    CommonModule,
    FormsModule,
    ToastModule,
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ContactListComponent implements OnInit {
  // For p-table
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  // For p-dropdown (Group filter)
  groupOptions: SelectItem[] = [];
  selectedGroup: string | null = null;

  // For p-autocomplete (Name search)
  nameControl = new FormControl('');
  nameSuggestions: string[] = [];

  // For p-multiselect (Tags filter)
  tagOptions: SelectItem[] = [];
  selectedTags: string[] = [];

  // For p-calendar (Date filter)
  selectedDateRange: Date[] = [];

  // For Add Contact Dialog
  showAddContactDialog = false;
  newContact: Partial<Contact> = {
    name: '',
    email: '',
    phone: '',
    group: undefined,
    tags: [],
    dateAdded: undefined,
  };

  // For View Contact Dialog
  showViewDialog = false;
  viewContact: Contact | null = null;

  // For row editing
  editingRows: { [key: number]: boolean } = {};
  originalRowData: { [key: number]: Contact } = {};

  constructor(
    private contactService: ContactService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Load contacts from localStorage if available
    const stored = localStorage.getItem('contacts');
    let initialContacts: Contact[];
    if (stored) {
      initialContacts = JSON.parse(stored).map((c: any) => ({
        ...c,
        dateAdded: new Date(c.dateAdded),
      }));
    } else {
      initialContacts = [
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '+1 555-1234',
          group: 'Friends',
          tags: ['VIP', 'Newsletter'],
          dateAdded: new Date(2025, 0, 15),
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob@example.com',
          phone: '+1 555-5678',
          group: 'Family',
          tags: ['Urgent'],
          dateAdded: new Date(2025, 1, 10),
        },
        {
          id: 3,
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          phone: '+1 555-9012',
          group: 'Work',
          tags: ['Newsletter'],
          dateAdded: new Date(2025, 2, 5),
        },
        // …add as many as needed
      ];
    }
    this.contactsSubject.next(initialContacts);

    // Subscribe to contacts changes
    this.contactsSubject.subscribe((contacts) => {
      this.contacts = contacts;
      this.filteredContacts = [...contacts];
      // Update group and tag options
      const groups = Array.from(new Set(contacts.map((c) => c.group)));
      this.groupOptions = groups.map((g) => ({ label: g, value: g }));
      this.groupOptions.unshift({ label: 'All Groups', value: null });
      const tags = Array.from(new Set(contacts.flatMap((c) => c.tags)));
      this.tagOptions = tags.map((t) => ({ label: t, value: t }));
      this.applyAllFilters();
      // Save to localStorage
      localStorage.setItem('contacts', JSON.stringify(contacts));
    });

    // Subscribe to nameControl value changes for autocomplete suggestions
    this.nameControl.valueChanges.subscribe((value) => {
      this.filterNameSuggestions(value ?? '');
      this.applyAllFilters();
    });
  }

  filterNameSuggestions(query: any) {
    // Accept both string and event object from p-autocomplete
    let search = '';
    if (typeof query === 'string') {
      search = query;
    } else if (query && typeof query.query === 'string') {
      search = query.query;
    }
    if (!search || search.trim().length === 0) {
      this.nameSuggestions = [];
      return;
    }
    const lower = search.toLowerCase();
    this.nameSuggestions = this.contacts
      .map((c) => c.name)
      .filter((name) => name.toLowerCase().includes(lower))
      .slice(0, 10);
  }

  onSelectNameSuggestion(name: any) {
    this.nameControl.setValue(name.value);
    this.applyAllFilters();
  }

  onGroupChange() {
    this.applyAllFilters();
  }

  onTagsChange() {
    this.applyAllFilters();
  }

  onDateRangeSelect() {
    this.applyAllFilters();
  }

  applyAllFilters() {
    this.filteredContacts = this.contacts.filter((c) => {
      // Group filter
      if (this.selectedGroup && c.group !== this.selectedGroup) {
        return false;
      }
      // Name filter
      const nameFilter = this.nameControl.value;
      if (
        nameFilter &&
        !c.name.toLowerCase().includes((nameFilter as string).toLowerCase())
      ) {
        return false;
      }
      // Tags filter
      if (
        this.selectedTags &&
        this.selectedTags.length > 0 &&
        !this.selectedTags.every((tag) => c.tags.includes(tag))
      ) {
        return false;
      }
      // Date range filter
      if (this.selectedDateRange && this.selectedDateRange.length === 2) {
        const [start, end] = this.selectedDateRange;
        // Ensure c.dateAdded is a Date object
        let date: Date;
        if (c.dateAdded instanceof Date) {
          date = c.dateAdded;
        } else if (
          typeof c.dateAdded === 'string' ||
          typeof c.dateAdded === 'number'
        ) {
          date = new Date(c.dateAdded);
        } else {
          return false;
        }
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (d < start || d > end) {
          return false;
        }
      }
      return true;
    });
  }

  onAddContactSubmit() {
    // Generate new id
    const newId =
      this.contacts.length > 0
        ? Math.max(...this.contacts.map((c) => c.id)) + 1
        : 1;
    const contact: Contact = {
      id: newId,
      name: this.newContact.name ?? '',
      email: this.newContact.email ?? '',
      phone: this.newContact.phone ?? '',
      group: this.newContact.group ?? '',
      tags: this.newContact.tags ?? [],
      dateAdded: this.newContact.dateAdded
        ? new Date(this.newContact.dateAdded)
        : new Date(),
    };
    // Add to contacts via subject
    this.contactsSubject.next([...this.contacts, contact]);
    this.showAddContactDialog = false;
    this.newContact = {
      name: '',
      email: '',
      phone: '',
      group: undefined,
      tags: [],
      dateAdded: undefined,
    };
  }
  filteredGroupOptions() {
    return this.groupOptions?.filter((g) => g && g.value !== null) || [];
  }

  onRowEditInit(rowData: Contact) {
    this.editingRows[rowData.id] = true;
    // Deep copy to restore on cancel
    this.originalRowData[rowData.id] = JSON.parse(JSON.stringify(rowData));
  }

  onRowEditSave(rowData: Contact) {
    // Validate required fields
    if (
      !rowData.name ||
      !rowData.email ||
      !rowData.phone ||
      !rowData.group ||
      !rowData.dateAdded
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'All fields are required.',
      });
      return;
    }
    // Optionally: validate email/phone format here
    delete this.originalRowData[rowData.id];
    this.editingRows[rowData.id] = false;
    this.applyAllFilters();
    this.messageService.add({
      severity: 'success',
      summary: 'Contact Updated',
      detail: 'Contact updated successfully.',
      life: 2000,
    });
  }

  onRowEditCancel(rowData: Contact, rowIndex: number) {
    // Restore original data
    const original = this.originalRowData[rowData.id];
    if (original) {
      Object.assign(rowData, original);
      delete this.originalRowData[rowData.id];
    }
    this.editingRows[rowData.id] = false;
  }

  onDeleteContact(rowData: Contact) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete contact "${rowData.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Remove from contacts via subject
        this.contactsSubject.next(
          this.contacts.filter((c) => c.id !== rowData.id)
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Contact Deleted',
          detail: 'Contact deleted successfully.',
        });
      },
    });
  }

  onViewContact(contact: Contact) {
    this.viewContact = contact;
    this.showViewDialog = true;
  }
}
