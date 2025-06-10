import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'host-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('host-app');
  });

  it('should call navigateToMFE with "/contacts" when Contact List command is executed', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'navigateToMFE');
    app.items[0].command && app.items[0].command!({ originalEvent: {} } as any);
    expect(app.navigateToMFE).toHaveBeenCalledWith('/contacts');
  });

  it('should call navigateToMFE with "/admin" when Admin Panel command is executed', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'navigateToMFE');
    app.items[1].command && app.items[1].command!({ originalEvent: {} } as any);
    expect(app.navigateToMFE).toHaveBeenCalledWith('/admin');
  });

  it('should set isLogin to true and isHome to false when navigated to /login', () => {
    const routerEvents$ = new Subject<any>();
    const mockRouter = {
      events: routerEvents$.asObservable(),
      url: '/login',
      navigate: jasmine.createSpy('navigate'),
    } as any;

    const fixture = TestBed.overrideProvider(Router, {
      useValue: mockRouter,
    }).createComponent(AppComponent);
    const app = fixture.componentInstance;

    routerEvents$.next(new NavigationEnd(1, '/somewhere', '/login'));
    expect(app.isLogin).toBeTrue();
    expect(app.isHome).toBeFalse();
  });

  it('should set isHome to true and isLogin to false when navigated to /', () => {
    const routerEvents$ = new Subject<any>();
    const mockRouter = {
      events: routerEvents$.asObservable(),
      url: '/',
      navigate: jasmine.createSpy('navigate'),
    } as any;

    const fixture = TestBed.overrideProvider(Router, {
      useValue: mockRouter,
    }).createComponent(AppComponent);
    const app = fixture.componentInstance;

    routerEvents$.next(new NavigationEnd(1, '/somewhere', '/'));
    expect(app.isHome).toBeTrue();
    expect(app.isLogin).toBeFalse();
  });

  it('should initialize cities array in ngOnInit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(app.cities).toEqual([
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ]);
  });

  it('should navigate to the given path in navigateToMFE', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    app.navigateToMFE('/some-path');
    expect(router.navigate).toHaveBeenCalledWith(['/some-path']);
  });

  it('should navigate to homeRoute in goHome', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    app.goHome();
    expect(router.navigate).toHaveBeenCalledWith([app.homeRoute]);
  });

  it('should navigate to /login in logout', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    app.logout();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call confirmationService.confirm and logout on accept in confirmLogout', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const confirmationService = fixture.debugElement.injector.get<any>(
      app['confirmationService'].constructor,
      app['confirmationService']
    );
    spyOn(confirmationService, 'confirm').and.callFake((options: any) => {
      // Simulate user accepting the confirmation
      options.accept();
    });
    spyOn(app, 'logout');
    app.confirmLogout();
    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(app.logout).toHaveBeenCalled();
  });
});
