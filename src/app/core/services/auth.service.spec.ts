import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginCredentials, RegisterData } from '@shared/models';

describe('AuthService (Unit - Mock Data)', () => {
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with null user and not authenticated', () => {
      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.isLoading()).toBe(false);
      expect(service.error()).toBeNull();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', fakeAsync(() => {
      const credentials: LoginCredentials = {
        email: 'admin@example.com',
        password: 'password123',
      };

      service.login(credentials).subscribe({
        next: (response) => {
          expect(response.user.email).toBe(credentials.email);
          expect(response.token).toContain('mock-token-');
        },
      });

      tick(600);

      expect(service.currentUser()).not.toBeNull();
      expect(service.isAuthenticated()).toBe(true);
      expect(service.isLoading()).toBe(false);
      expect(localStorage.getItem('auth_token')).toContain('mock-token-');
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should handle login error with invalid credentials', fakeAsync(() => {
      const credentials: LoginCredentials = {
        email: 'invalid@example.com',
        password: 'wrong-password',
      };

      service.login(credentials).subscribe({
        error: () => {
          expect(service.error()).toBe('Invalid email or password');
          expect(service.currentUser()).toBeNull();
          expect(service.isAuthenticated()).toBe(false);
        },
      });

      tick(600);
      expect(service.isLoading()).toBe(false);
    }));
  });

  describe('register', () => {
    it('should register successfully', fakeAsync(() => {
      const registerData: RegisterData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: 'developer',
      };

      service.register(registerData).subscribe({
        next: (response) => {
          expect(response.user.email).toBe(registerData.email);
          expect(response.user.firstName).toBe(registerData.firstName);
        },
      });

      tick(600);

      expect(service.isAuthenticated()).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should handle registration error for existing email', fakeAsync(() => {
      const registerData: RegisterData = {
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      service.register(registerData).subscribe({
        error: () => {
          expect(service.error()).toBe('User with this email already exists');
        },
      });

      tick(600);
    }));
  });

  describe('logout', () => {
    it('should clear user state and navigate to login', fakeAsync(() => {
      const credentials: LoginCredentials = {
        email: 'admin@example.com',
        password: 'password123',
      };

      service.login(credentials).subscribe();
      tick(600);

      service.logout();

      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    }));
  });

  describe('Password Reset', () => {
    it('should send password reset request', fakeAsync(() => {
      const request = { email: 'test@example.com' };

      service.requestPasswordReset(request).subscribe({
        next: () => {
          expect(service.isLoading()).toBe(false);
        },
      });

      tick(600);
    }));

    it('should confirm password reset', fakeAsync(() => {
      const confirm = {
        token: 'reset-token',
        newPassword: 'newpassword123',
      };

      service.confirmPasswordReset(confirm).subscribe({
        next: () => {
          expect(service.isLoading()).toBe(false);
        },
      });

      tick(600);
    }));
  });

  describe('Token Management', () => {
    it('should store and retrieve token', fakeAsync(() => {
      const credentials: LoginCredentials = {
        email: 'admin@example.com',
        password: 'password123',
      };

      service.login(credentials).subscribe();
      tick(600);

      const token = service.getStoredToken();
      expect(token).toContain('mock-token-');
    }));

    it('should return null when no token stored', () => {
      const token = service.getStoredToken();
      expect(token).toBeNull();
    });
  });

  describe('Initialize Auth', () => {
    it('should restore user from localStorage on init', () => {
      const mockUser = { email: 'test@example.com', firstName: 'Test', lastName: 'User' };
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('current_user', JSON.stringify(mockUser));

      service.initializeAuth();

      expect(service.currentUser()).not.toBeNull();
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should handle invalid user data in localStorage', () => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('current_user', 'invalid-json');

      service.initializeAuth();

      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
