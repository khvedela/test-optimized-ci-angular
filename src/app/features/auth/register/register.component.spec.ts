import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '@core/services/auth.service';

describe('RegisterComponent (Unit)', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn().mockReturnValue(of({})),
      isLoading: signal(false).asReadonly(),
      error: signal(null).asReadonly(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideAnimations(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.registerForm.value).toEqual({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: 'developer',
    });
  });

  it('should have password hidden by default', () => {
    expect(component.hidePassword()).toBe(true);
    expect(component.hideConfirmPassword()).toBe(true);
  });

  describe('Form Validation', () => {
    it('should mark form as invalid when empty', () => {
      expect(component.registerForm.valid).toBe(false);
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.controls.email;
      emailControl.setValue('invalid');
      expect(emailControl.hasError('email')).toBe(true);

      emailControl.setValue('valid@example.com');
      expect(emailControl.hasError('email')).toBe(false);
    });

    it('should validate password length', () => {
      const passwordControl = component.registerForm.controls.password;
      passwordControl.setValue('12345');
      expect(passwordControl.hasError('minlength')).toBe(true);

      passwordControl.setValue('123456');
      expect(passwordControl.hasError('minlength')).toBe(false);
    });

    it('should validate password match', () => {
      component.registerForm.patchValue({
        password: 'password123',
        confirmPassword: 'different',
      });
      expect(component.registerForm.hasError('passwordMismatch')).toBe(true);

      component.registerForm.patchValue({
        confirmPassword: 'password123',
      });
      expect(component.registerForm.hasError('passwordMismatch')).toBe(false);
    });

    it('should validate required fields', () => {
      expect(component.registerForm.controls.email.hasError('required')).toBe(true);
      expect(component.registerForm.controls.password.hasError('required')).toBe(true);
      expect(component.registerForm.controls.firstName.hasError('required')).toBe(true);
      expect(component.registerForm.controls.lastName.hasError('required')).toBe(true);
    });
  });

  describe('Password Visibility', () => {
    it('should toggle password visibility', () => {
      expect(component.hidePassword()).toBe(true);
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(false);
    });

    it('should toggle confirm password visibility', () => {
      expect(component.hideConfirmPassword()).toBe(true);
      component.toggleConfirmPasswordVisibility();
      expect(component.hideConfirmPassword()).toBe(false);
    });
  });

  describe('Form Submission', () => {
    it('should not submit invalid form', () => {
      component.onSubmit();
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('should submit valid form', () => {
      component.registerForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'developer',
      });

      component.onSubmit();
      expect(mockAuthService.register).toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      component.onSubmit();
      expect(component.registerForm.controls.email.touched).toBe(true);
      expect(component.registerForm.controls.password.touched).toBe(true);
    });
  });

  describe('Error Messages', () => {
    it('should return correct error message for email', () => {
      const emailControl = component.registerForm.controls.email;
      
      emailControl.markAsTouched();
      expect(component.getEmailErrorMessage()).toBe('Email is required');

      emailControl.setValue('invalid');
      expect(component.getEmailErrorMessage()).toBe('Please enter a valid email');

      emailControl.setValue('valid@example.com');
      expect(component.getEmailErrorMessage()).toBe('');
    });

    it('should return correct error message for password', () => {
      const passwordControl = component.registerForm.controls.password;
      
      passwordControl.markAsTouched();
      expect(component.getPasswordErrorMessage()).toBe('Password is required');

      passwordControl.setValue('12345');
      expect(component.getPasswordErrorMessage()).toBe('Password must be at least 6 characters');

      passwordControl.setValue('123456');
      expect(component.getPasswordErrorMessage()).toBe('');
    });

    it('should return correct error message for first name', () => {
      const firstNameControl = component.registerForm.controls.firstName;
      
      firstNameControl.markAsTouched();
      expect(component.getFirstNameErrorMessage()).toBe('First name is required');

      firstNameControl.setValue('John');
      expect(component.getFirstNameErrorMessage()).toBe('');
    });

    it('should return correct error message for last name', () => {
      const lastNameControl = component.registerForm.controls.lastName;
      
      lastNameControl.markAsTouched();
      expect(component.getLastNameErrorMessage()).toBe('Last name is required');

      lastNameControl.setValue('Doe');
      expect(component.getLastNameErrorMessage()).toBe('');
    });
  });
});
