import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Test Configuration', () => {
  it('should provide http client for testing', () => {
    const providers = [provideHttpClient(), provideHttpClientTesting()];
    expect(providers).toBeDefined();
    expect(providers.length).toBe(2);
  });

  it('should have provider functions defined', () => {
    expect(provideHttpClient).toBeDefined();
    expect(provideHttpClientTesting).toBeDefined();
  });
});
