import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Mfe2Component } from './mfe2/mfe2.component';
import { ContactAdminComponent } from './contact-admin/contact-admin.component';

@Component({
  selector: 'app-root',
  imports: [Mfe2Component, ContactAdminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'mfe2';
}
