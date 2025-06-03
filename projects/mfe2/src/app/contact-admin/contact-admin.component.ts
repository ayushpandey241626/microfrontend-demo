import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

export interface Announcement {
  id: number;
  title: string;
  message: string;
  publishDate: Date;
}

@Component({
  selector: 'app-contact-admin',
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
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
  templateUrl: './contact-admin.component.html',
  styleUrl: './contact-admin.component.css',
  providers: [MessageService],
})
export class ContactAdminComponent {
  announcementForm: FormGroup;
  announcements: Announcement[] = [];
  nextId = 1;

  constructor(private fb: FormBuilder) {
    this.announcementForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(5)]],
      publishDate: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.announcements = [
      {
        id: this.nextId++,
        title: 'Welcome to Admin Panel',
        message: 'This is a sample announcement. Feel free to add more!',
        publishDate: new Date(),
      },
    ];
  }
  addAnnouncement() {
    if (this.announcementForm.invalid) {
      this.announcementForm.markAllAsTouched();
      return;
    }

    const { title, message, publishDate } = this.announcementForm.value;
    const newAnn: Announcement = {
      id: this.nextId++,
      title,
      message,
      publishDate,
    };
    this.announcements.unshift(newAnn);
    this.announcementForm.reset();
  }

  removeAnnouncement(id: number) {
    this.announcements = this.announcements.filter((a) => a.id !== id);
  }
}
