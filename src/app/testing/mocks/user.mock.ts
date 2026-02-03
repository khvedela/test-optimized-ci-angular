import { User, UserRole } from '@shared/models';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'developer' as UserRole,
  avatar: 'https://i.pravatar.cc/150?img=1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockUsers = (count: number): User[] => {
  const roles: UserRole[] = ['admin', 'project-manager', 'developer', 'viewer'];
  return Array.from({ length: count }, (_, i) =>
    createMockUser({
      id: `${i + 1}`,
      email: `user${i + 1}@example.com`,
      firstName: `User`,
      lastName: `${i + 1}`,
      role: roles[i % roles.length],
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
    })
  );
};

export const mockAdmin = createMockUser({
  id: 'admin-1',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
});

export const mockProjectManager = createMockUser({
  id: 'pm-1',
  email: 'pm@example.com',
  firstName: 'Project',
  lastName: 'Manager',
  role: 'project-manager',
});

export const mockDeveloper = createMockUser({
  id: 'dev-1',
  email: 'dev@example.com',
  firstName: 'Developer',
  lastName: 'User',
  role: 'developer',
});

export const mockViewer = createMockUser({
  id: 'viewer-1',
  email: 'viewer@example.com',
  firstName: 'Viewer',
  lastName: 'User',
  role: 'viewer',
});
