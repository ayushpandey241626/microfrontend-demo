import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DropdownModule,
    MenubarModule,
    ButtonModule,
    CommonModule,
    ConfirmDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ConfirmationService],
})
export class AppComponent {
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
  homeRoute = '/';
  cities: { name: string; code: string }[] | undefined;
  isHome = false;
  isLogin = false;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLogin = event.urlAfterRedirects === '/login';
        this.isHome = this.router.url === '/';
      }
    });
  }

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
  goHome() {
    this.router.navigate([this.homeRoute]);
  }
  logout() {
    // Optionally clear any auth state here
    this.router.navigate(['/login']);
  }

  confirmLogout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Confirm Logout',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.logout();
      },
    });
  }
}
