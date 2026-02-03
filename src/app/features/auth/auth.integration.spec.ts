import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from '@core/services/auth.service';
import { LoginComponent } from './login/login.component';
import { routes } from '../../app.routes';

describe('Auth Integration Tests', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideAnimations(),
        AuthService,
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('Login Flow', () => {
    it('should successfully login with valid credentials', (done) => {
      const credentials = {
        email: 'admin@example.com',
        password: 'password123',
      };

      authService.login(credentials).subscribe({
        next: (response) => {
          expect(response).toBeDefined();
          expect(response.user).toBeDefined();
          expect(response.user.email).toBe(credentials.email);
          expect(authService.isAuthenticated()).toBe(true);
          done();
        },
        error: (error) => {
          fail(`Login should succeed: ${error}`);
        },
      });
    });

    it('should fail login with invalid credentials', (done) => {
      const credentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      authService.login(credentials).subscribe({
        next: () => {
          fail('Login should fail with invalid credentials');
        },
        error: (error) => {
          expect(error.message).toBe('Invalid credentials');
          expect(authService.isAuthenticated()).toBe(false);
          done();
        },
      });
    });

    it('should maintain authentication state after login', (done) => {
      const credentials = {
        email: 'dev@example.com',
        password: 'password123',
      };

      authService.login(credentials).subscribe(() => {
        expect(authService.isAuthenticated()).toBe(true);
        expect(authService.currentUser()).toBeDefined();
        expect(authService.currentUser()?.email).toBe(credentials.email);
        done();
      });
    });
  });

  describe('Registration Flow', () => {
    it('should successfully register new user', (done) => {
      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: 'developer' as const,
      };

      authService.register(registerData).subscribe({
        next: (response) => {
          expect(response).toBeDefined();
          expect(response.user.email).toBe(registerData.email);
          expect(authService.isAuthenticated()).toBe(true);
          done();
        },
        error: (error) => {
          fail(`Registration should succeed: ${error}`);
        },
      });
    });

    it('should prevent registration with existing email', (done) => {
      const registerData = {
        email: 'admin@example.com', // Already exists
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      authService.register(registerData).subscribe({
        next: () => {
          fail('Registration should fail for existing email');
        },
        error: (error) => {
          expect(error.message).toBe('User already exists');
          done();
        },
      });
    });
  });

  describe('Logout Flow', () => {
    it('should clear authentication state on logout', (done) => {
      const credentials = {
        email: 'manager@example.com',
        password: 'password123',
      };

      // First login
      authService.login(credentials).subscribe(() => {
        expect(authService.isAuthenticated()).toBe(true);

        // Then logout
        authService.logout();

        expect(authService.isAuthenticated()).toBe(false);
        expect(authService.currentUser()).toBeNull();
        done();
      });
    });
  });

  describe('Token Management', () => {
    it('should store tokens in localStorage after login', (done) => {
      const credentials = {
        email: 'admin@example.com',
        password: 'password123',
      };

      authService.login(credentials).subscribe(() => {
        const token = localStorage.getItem('auth_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const currentUser = localStorage.getItem('current_user');

        expect(token).toBeTruthy();
        expect(refreshToken).toBeTruthy();
        expect(currentUser).toBeTruthy();
        done();
      });
    });

    it('should clear tokens from localStorage on logout', (done) => {
      const credentials = {
        email: 'dev@example.com',
        password: 'password123',
      };

      authService.login(credentials).subscribe(() => {
        authService.logout();

        const token = localStorage.getItem('auth_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const currentUser = localStorage.getItem('current_user');

        expect(token).toBeNull();
        expect(refreshToken).toBeNull();
        expect(currentUser).toBeNull();
        done();
      });
    });
  });
});
