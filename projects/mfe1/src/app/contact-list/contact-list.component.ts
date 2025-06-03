import { Component } from '@angular/core';
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
    ButtonModule,
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
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
})
export class ContactListComponent {
  // For p-table
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

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    // Populate with some mock contacts (in real app, fetch from API)
    this.contacts = [
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
    this.filteredContacts = [...this.contacts];

    // Group options
    const groups = Array.from(new Set(this.contacts.map((c) => c.group)));
    this.groupOptions = groups.map((g) => ({ label: g, value: g }));
    this.groupOptions.unshift({ label: 'All Groups', value: null });

    // Tag options
    const tags = Array.from(new Set(this.contacts.flatMap((c) => c.tags)));
    this.tagOptions = tags.map((t) => ({ label: t, value: t }));

    // Subscribe to nameControl value changes for autocomplete suggestions
    this.nameControl.valueChanges.subscribe((value) => {
      this.filterNameSuggestions(value ?? '');
      this.applyAllFilters();
    });
  }

  filterNameSuggestions(query: any) {
    if (!query || query.trim().length === 0) {
      this.nameSuggestions = [];
      return;
    }
    const lower = query.toLowerCase();
    this.nameSuggestions = this.contacts
      .map((c) => c.name)
      .filter((name) => name.toLowerCase().includes(lower))
      .slice(0, 10);
  }

  onSelectNameSuggestion(name: any) {
    this.nameControl.setValue(name);
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
        const d = new Date(
          c.dateAdded.getFullYear(),
          c.dateAdded.getMonth(),
          c.dateAdded.getDate()
        );
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
    this.contacts.push(contact);

    // Update groupOptions and tagOptions if new values are added
    if (
      contact.group &&
      !this.groupOptions.some((g) => g.value === contact.group)
    ) {
      this.groupOptions.push({ label: contact.group, value: contact.group });
    }
    contact.tags.forEach((tag) => {
      if (tag && !this.tagOptions.some((t) => t.value === tag)) {
        this.tagOptions.push({ label: tag, value: tag });
      }
    });

    this.applyAllFilters();
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
}
