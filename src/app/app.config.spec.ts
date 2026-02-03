import { appConfig } from './app.config';

describe('App Config', () => {
  it('should be defined', () => {
    expect(appConfig).toBeDefined();
  });

  it('should have providers array', () => {
    expect(appConfig.providers).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBe(true);
  });

  it('should have router provider', () => {
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });
});
