import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DropdownModule, MenubarModule, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private router: Router) {}
  items: MenuItem[] = [
    {
      label: 'Contact List',
      icon: 'pi pi-users',
      command: () => this.navigateToMFE('/contacts'),
    },
    {
      label: 'Admin Panel',
      icon: 'pi pi-cog',
      command: () => this.navigateToMFE('/admin'),
    },
  ];
  title = 'host-app';
  cities: { name: string; code: string }[] | undefined;
  ngOnInit() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
  }

  navigateToMFE(path: string) {
    this.router.navigate([path]);
  }
}
