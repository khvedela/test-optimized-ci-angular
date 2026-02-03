import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { signal, computed } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/services/auth.service';
import { createMockUser } from '@testing/mocks';
import { AuthResponse } from '@shared/models';

describe('LoginComponent (Unit)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jest.Mocked<Partial<AuthService>>;
  let router: Router;
  let isLoadingSignal: any;
  let errorSignal: any;

  beforeEach(async () => {
    // Arrange - Create signal mocks
    isLoadingSignal = signal(false);
    errorSignal = signal<string | null>(null);
    const isAuthenticatedSignal = signal(false).asReadonly();

    // Arrange - Create mocks
    mockAuthService = {
      login: jest.fn(),
      isAuthenticated: isAuthenticatedSignal,
      isLoading: isLoadingSignal.asReadonly(),
      error: errorSignal.asReadonly(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideAnimations(),
        provideRouter([
          { path: 'dashboard', component: LoginComponent },
          { path: 'auth/login', component: LoginComponent },
          { path: 'auth/register', component: LoginComponent },
          { path: 'auth/forgot-password', component: LoginComponent },
        ]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      // Assert
      expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
      // Assert
      expect(component.loginForm.value).toEqual({
        email: '',
        password: '',
      });
    });

    it('should have password hidden by default', () => {
      // Assert
      expect(component.hidePassword()).toBe(true);
    });

    it('should redirect to dashboard if already authenticated', () => {
      // Arrange
      const authSignal = computed(() => true);
      mockAuthService.isAuthenticated = authSignal;
      const newFixture = TestBed.createComponent(LoginComponent);

      // Act - Component ngOnInit runs on creation
      newFixture.detectChanges();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should not redirect if not authenticated', () => {
      // Assert - Already initialized with authenticated=false in beforeEach
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should mark form as invalid when empty', () => {
      // Assert
      expect(component.loginForm.valid).toBe(false);
    });

    it('should mark email as invalid when empty', () => {
      // Act
      component.loginForm.controls.email.setValue('');
      component.loginForm.controls.email.markAsTouched();

      // Assert
      expect(component.loginForm.controls.email.valid).toBe(false);
      expect(component.loginForm.controls.email.hasError('required')).toBe(true);
    });

    it('should mark email as invalid with invalid format', () => {
      // Act
      component.loginForm.controls.email.setValue('invalid-email');
      component.loginForm.controls.email.markAsTouched();

      // Assert
      expect(component.loginForm.controls.email.valid).toBe(false);
      expect(component.loginForm.controls.email.hasError('email')).toBe(true);
    });

    it('should mark email as valid with correct format', () => {
      // Act
      component.loginForm.controls.email.setValue('test@example.com');

      // Assert
      expect(component.loginForm.controls.email.valid).toBe(true);
    });

    it('should mark password as invalid when empty', () => {
      // Act
      component.loginForm.controls.password.setValue('');
      component.loginForm.controls.password.markAsTouched();

      // Assert
      expect(component.loginForm.controls.password.valid).toBe(false);
      expect(component.loginForm.controls.password.hasError('required')).toBe(true);
    });

    it('should mark password as invalid when too short', () => {
      // Act
      component.loginForm.controls.password.setValue('12345');
      component.loginForm.controls.password.markAsTouched();

      // Assert
      expect(component.loginForm.controls.password.valid).toBe(false);
      expect(component.loginForm.controls.password.hasError('minlength')).toBe(true);
    });

    it('should mark password as valid with at least 6 characters', () => {
      // Act
      component.loginForm.controls.password.setValue('123456');

      // Assert
      expect(component.loginForm.controls.password.valid).toBe(true);
    });

    it('should mark form as valid with correct email and password', () => {
      // Act
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      // Assert
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('Error Messages', () => {
    it('should return required error message for empty email', () => {
      // Arrange
      component.loginForm.controls.email.setValue('');
      component.loginForm.controls.email.markAsTouched();

      // Act
      const errorMessage = component.getEmailErrorMessage();

      // Assert
      expect(errorMessage).toBe('Email is required');
    });

    it('should return format error message for invalid email', () => {
      // Arrange
      component.loginForm.controls.email.setValue('invalid-email');
      component.loginForm.controls.email.markAsTouched();

      // Act
      const errorMessage = component.getEmailErrorMessage();

      // Assert
      expect(errorMessage).toBe('Please enter a valid email');
    });

    it('should return empty string for valid email', () => {
      // Arrange
      component.loginForm.controls.email.setValue('test@example.com');

      // Act
      const errorMessage = component.getEmailErrorMessage();

      // Assert
      expect(errorMessage).toBe('');
    });

    it('should return required error message for empty password', () => {
      // Arrange
      component.loginForm.controls.password.setValue('');
      component.loginForm.controls.password.markAsTouched();

      // Act
      const errorMessage = component.getPasswordErrorMessage();

      // Assert
      expect(errorMessage).toBe('Password is required');
    });

    it('should return minlength error message for short password', () => {
      // Arrange
      component.loginForm.controls.password.setValue('12345');
      component.loginForm.controls.password.markAsTouched();

      // Act
      const errorMessage = component.getPasswordErrorMessage();

      // Assert
      expect(errorMessage).toBe('Password must be at least 6 characters');
    });

    it('should return empty string for valid password', () => {
      // Arrange
      component.loginForm.controls.password.setValue('password123');

      // Act
      const errorMessage = component.getPasswordErrorMessage();

      // Assert
      expect(errorMessage).toBe('');
    });
  });

  describe('Form Submission', () => {
    it('should call authService.login with form values when valid', () => {
      // Arrange
      const mockResponse: AuthResponse = {
        user: createMockUser(),
        token: 'token',
        refreshToken: 'refresh',
      };
      mockAuthService.login = jest.fn().mockReturnValue(of(mockResponse));
      
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      // Act
      component.onSubmit();

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should not call authService.login when form is invalid', () => {
      // Arrange
      component.loginForm.patchValue({
        email: 'invalid',
        password: '123',
      });

      // Act
      component.onSubmit();

      // Assert
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      // Arrange
      component.loginForm.patchValue({
        email: '',
        password: '',
      });

      // Act
      component.onSubmit();

      // Assert
      expect(component.loginForm.controls.email.touched).toBe(true);
      expect(component.loginForm.controls.password.touched).toBe(true);
    });

    it('should handle login error', () => {
      // Arrange
      const error = { message: 'Invalid credentials' };
      mockAuthService.login = jest.fn().mockReturnValue(throwError(() => error));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      // Act
      component.onSubmit();

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('Login failed:', error);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility from hidden to visible', () => {
      // Arrange
      expect(component.hidePassword()).toBe(true);

      // Act
      component.togglePasswordVisibility();

      // Assert
      expect(component.hidePassword()).toBe(false);
    });

    it('should toggle password visibility from visible to hidden', () => {
      // Arrange
      component.hidePassword.set(false);

      // Act
      component.togglePasswordVisibility();

      // Assert
      expect(component.hidePassword()).toBe(true);
    });

    it('should toggle multiple times correctly', () => {
      // Act & Assert
      expect(component.hidePassword()).toBe(true);
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(false);
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(true);
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    it('should display email input field', () => {
      // Act
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]');

      // Assert
      expect(emailInput).toBeTruthy();
    });

    it('should display password input field', () => {
      // Act
      const passwordInput = fixture.nativeElement.querySelector('input[formControlName="password"]');

      // Assert
      expect(passwordInput).toBeTruthy();
    });

    it('should display submit button', () => {
      // Act
      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');

      // Assert
      expect(submitButton).toBeTruthy();
      expect(submitButton.textContent.trim()).toContain('Login');
    });

    it('should display password visibility toggle button', () => {
      // Act
      const toggleButton = fixture.nativeElement.querySelector('button[matSuffix]');

      // Assert
      expect(toggleButton).toBeTruthy();
    });

    it('should display links to register and forgot password', () => {
      // Act
      const links = fixture.nativeElement.querySelectorAll('a');

      // Assert
      expect(links.length).toBeGreaterThanOrEqual(2);
      const linkTexts = Array.from(links).map((link: any) => link.textContent);
      expect(linkTexts.some((text: string) => text.includes('Forgot password'))).toBe(true);
      expect(linkTexts.some((text: string) => text.includes('Register'))).toBe(true);
    });

    it('should display error message when error exists', () => {
      // Arrange
      mockAuthService.error = jest.fn().mockReturnValue('Login failed');
      fixture = TestBed.createComponent(LoginComponent);
      fixture.detectChanges();

      // Act
      const errorMessage = fixture.nativeElement.querySelector('.error-message');

      // Assert
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toContain('Login failed');
    });

    it('should not display error message when no error', () => {
      // Act
      const errorMessage = fixture.nativeElement.querySelector('.error-message');

      // Assert
      expect(errorMessage).toBeFalsy();
    });

    it('should disable submit button when loading', () => {
      // Arrange
      mockAuthService.isLoading = jest.fn().mockReturnValue(true);
      fixture = TestBed.createComponent(LoginComponent);
      fixture.detectChanges();

      // Act
      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');

      // Assert
      expect(submitButton.disabled).toBe(true);
    });

    it('should change password input type when visibility toggled', () => {
      // Arrange
      const passwordInput = fixture.nativeElement.querySelector('input[formControlName="password"]');
      expect(passwordInput.type).toBe('password');

      // Act
      component.togglePasswordVisibility();
      fixture.detectChanges();

      // Assert
      expect(passwordInput.type).toBe('text');
    });
  });
});
