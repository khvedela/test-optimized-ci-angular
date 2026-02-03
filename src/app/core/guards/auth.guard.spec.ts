import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal, computed } from '@angular/core';
import { authGuard } from './auth.guard';
import { AuthService } from '@core/services/auth.service';

describe('authGuard (Unit)', () => {
  let mockAuthService: any;
  let mockRouter: jest.Mocked<Partial<Router>>;

  beforeEach(() => {
    // Arrange - Create mocks with signals
    const isAuthenticatedSignal = computed(() => true);
    mockAuthService = {
      isAuthenticated: isAuthenticatedSignal,
    };

    mockRouter = {
      createUrlTree: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should allow access when user is authenticated', () => {
    // Arrange
    const isAuthenticatedSignal = computed(() => true);
    mockAuthService.isAuthenticated = isAuthenticatedSignal;

    // Act
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    // Assert
    expect(result).toBe(true);
  });

  it('should redirect to login when user is not authenticated', () => {
    // Arrange
    const isAuthenticatedSignal = computed(() => false);
    mockAuthService.isAuthenticated = isAuthenticatedSignal;
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree = jest.fn().mockReturnValue(mockUrlTree);

    // Act
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    // Assert
    expect(result).toBe(mockUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
  });
});
