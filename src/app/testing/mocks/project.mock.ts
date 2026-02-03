import { Project, ProjectStatus } from '@shared/models';

export const createMockProject = (overrides?: Partial<Project>): Project => ({
  id: '1',
  name: 'Test Project',
  description: 'A test project for development',
  status: 'active' as ProjectStatus,
  ownerId: '1',
  memberIds: ['1', '2', '3'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockProjects = (count: number): Project[] => {
  const statuses: ProjectStatus[] = ['active', 'archived', 'completed'];
  return Array.from({ length: count }, (_, i) =>
    createMockProject({
      id: `${i + 1}`,
      name: `Project ${i + 1}`,
      description: `Description for project ${i + 1}`,
      status: statuses[i % statuses.length],
      ownerId: `${(i % 3) + 1}`,
      memberIds: [`${i + 1}`, `${i + 2}`, `${i + 3}`],
    })
  );
};
