import { AUTH_ROUTES } from './features/auth/auth.routes';
import { DASHBOARD_ROUTES } from './features/dashboard/dashboard.routes';
import { PROJECTS_ROUTES } from './features/projects/projects.routes';
import { TASKS_ROUTES } from './features/tasks/tasks.routes';
import { USERS_ROUTES } from './features/users/users.routes';

describe('App Routes', () => {
  it('should have auth routes configured', () => {
    expect(AUTH_ROUTES).toBeDefined();
    expect(AUTH_ROUTES.length).toBeGreaterThan(0);
  });

  it('should have dashboard routes configured', () => {
    expect(DASHBOARD_ROUTES).toBeDefined();
    expect(DASHBOARD_ROUTES.length).toBeGreaterThan(0);
  });

  it('should have projects routes configured', () => {
    expect(PROJECTS_ROUTES).toBeDefined();
    expect(PROJECTS_ROUTES.length).toBeGreaterThan(0);
  });

  it('should have tasks routes configured', () => {
    expect(TASKS_ROUTES).toBeDefined();
    expect(TASKS_ROUTES.length).toBeGreaterThan(0);
  });

  it('should have users routes configured', () => {
    expect(USERS_ROUTES).toBeDefined();
    expect(USERS_ROUTES.length).toBeGreaterThan(0);
  });
});
