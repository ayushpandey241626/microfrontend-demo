import { Component } from '@angular/core';
import { LoginFormComponent } from './login/login-form/login-form.component';

@Component({
  selector: 'app-root',
  imports: [LoginFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'login-mfe-app';
}
