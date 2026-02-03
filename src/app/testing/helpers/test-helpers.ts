import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

/**
 * Standard testing providers for components
 */
export const getTestingProviders = () => [
  provideHttpClient(),
  provideAnimations(),
  provideRouter([]),
];

/**
 * Helper to wait for async operations
 */
export const waitForAsync = (ms = 0): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Helper to trigger change detection
 */
export const flushMicrotasks = (): Promise<void> => {
  return Promise.resolve();
};
