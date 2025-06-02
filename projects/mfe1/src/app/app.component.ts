import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Mfe1Component } from './mfe1/mfe1.component';
import { ContactListComponent } from './contact-list/contact-list.component';

@Component({
  selector: 'app-root',
  imports: [Mfe1Component, ContactListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'mfe1';
}
