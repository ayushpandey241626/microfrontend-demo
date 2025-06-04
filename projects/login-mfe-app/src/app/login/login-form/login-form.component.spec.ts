import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should show error if username is empty and touched', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.markAsTouched();
    fixture.detectChanges();
    const errorElem = fixture.debugElement.query(By.css('.error'));
    expect(errorElem.nativeElement.textContent).toContain('Username is required');
  });

  it('should show error if password is empty and touched', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.markAsTouched();
    fixture.detectChanges();
    const errorElem = fixture.debugElement.queryAll(By.css('.error'))[1];
    expect(errorElem.nativeElement.textContent).toContain('Password is required');
  });

  it('should set loginError if form is invalid on submit', () => {
    component.onSubmit();
    expect(component.loginError).toBe('Please fill in all fields');
  });

  it('should set loginError if username or password is empty', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();
    expect(component.loginError).toBe('Please fill in all fields');
  });

  it('should navigate to /contacts on valid login', () => {
    component.loginForm.setValue({ username: 'user', password: 'pass' });
    component.onSubmit();
    expect(component.loginError).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/contacts']);
  });

  it('should set loginError if username or password is missing', () => {
    component.loginForm.setValue({ username: 'user', password: '' });
    component.onSubmit();
    expect(component.loginError).toBe('Invalid username or password');
  });
});
