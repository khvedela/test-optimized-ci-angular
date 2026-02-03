import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '@core/services/auth.service';

describe('authInterceptor (Unit)', () => {
  let mockAuthService: jest.Mocked<Partial<AuthService>>;
  let mockNext: jest.MockedFunction<HttpHandlerFn>;

  beforeEach(() => {
    // Arrange
    mockAuthService = {
      getStoredToken: jest.fn(),
    };

    mockNext = jest.fn((req) => of({} as HttpEvent<any>));

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
  });

  it('should add Authorization header when token exists', (done) => {
    // Arrange
    const token = 'test-token';
    mockAuthService.getStoredToken = jest.fn().mockReturnValue(token);
    const request = new HttpRequest('GET', '/api/test');

    // Act
    TestBed.runInInjectionContext(() => {
      authInterceptor(request, mockNext).subscribe(() => {
        // Assert
        expect(mockNext).toHaveBeenCalledWith(
          expect.objectContaining({
            headers: expect.objectContaining({
              lazyUpdate: expect.arrayContaining([
                expect.objectContaining({
                  name: 'Authorization',
                  value: `Bearer ${token}`,
                }),
              ]),
            }),
          })
        );
        done();
      });
    });
  });

  it('should not add Authorization header when token does not exist', (done) => {
    // Arrange
    mockAuthService.getStoredToken = jest.fn().mockReturnValue(null);
    const request = new HttpRequest('GET', '/api/test');

    // Act
    TestBed.runInInjectionContext(() => {
      authInterceptor(request, mockNext).subscribe(() => {
        // Assert
        expect(mockNext).toHaveBeenCalledWith(request);
        done();
      });
    });
  });
});
