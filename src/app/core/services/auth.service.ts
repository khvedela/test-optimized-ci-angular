import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay } from 'rxjs';
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  PasswordResetRequest,
  PasswordResetConfirm,
} from '@shared/models';
import { createMockUser, mockAdmin, mockDeveloper } from '@testing/mocks/user.mock';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';
  
  // Mock users database
  private mockUsers: User[] = [
    { ...mockAdmin, password: 'password123' },
    { ...mockDeveloper, password: 'password123' },
    { ...createMockUser({ role: 'project-manager' }), email: 'manager@example.com', password: 'password123' },
  ];

  // Signals for state management
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // Public computed signals
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /**
   * Initialize auth state from stored token
   */
  initializeAuth(): void {
    const token = this.getStoredToken();
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSignal.set(user);
      } catch {
        this.logout();
      }
    }
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(null).pipe(
      delay(500),
      (obs) => {
        const user = this.mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
          this.errorSignal.set('Invalid email or password');
          this.loadingSignal.set(false);
          return throwError(() => new Error('Invalid credentials'));
        }

        const response: AuthResponse = {
          user,
          token: `mock-token-${Date.now()}`,
          refreshToken: `mock-refresh-${Date.now()}`,
        };

        this.handleAuthSuccess(response);
        return of(response);
      }
    );
  }

  /**
   * Register a new user
   */
  register(data: RegisterData): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(null).pipe(
      delay(500),
      (obs) => {
        // Check if user already exists
        const existingUser = this.mockUsers.find(u => u.email === data.email);
        if (existingUser) {
          this.errorSignal.set('User with this email already exists');
          this.loadingSignal.set(false);
          return throwError(() => new Error('User already exists'));
        }

        const newUser: User = {
          ...createMockUser({ role: data.role || 'developer' }),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
        };

        this.mockUsers.push(newUser);

        const response: AuthResponse = {
          user: newUser,
          token: `mock-token-${Date.now()}`,
          refreshToken: `mock-refresh-${Date.now()}`,
        };

        this.handleAuthSuccess(response);
        return of(response);
      }
    );
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.clearAuthData();
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Request password reset
   */
  requestPasswordReset(request: PasswordResetRequest): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(void 0).pipe(
      delay(500),
      (obs) => {
        this.loadingSignal.set(false);
        return obs;
      }
    );
  }

  /**
   * Confirm password reset with token
   */
  confirmPasswordReset(confirm: PasswordResetConfirm): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(void 0).pipe(
      delay(500),
      (obs) => {
        this.loadingSignal.set(false);
        return obs;
      }
    );
  }

  /**
   * Get stored authentication token
   */
  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   */
  getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    this.currentUserSignal.set(response.user);
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.loadingSignal.set(false);
    this.router.navigate(['/dashboard']);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
