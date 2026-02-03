import { Task, TaskStatus, TaskPriority } from '@shared/models';

export const createMockTask = (overrides?: Partial<Task>): Task => ({
  id: '1',
  title: 'Test Task',
  description: 'A test task for development',
  status: 'todo' as TaskStatus,
  priority: 'medium' as TaskPriority,
  projectId: '1',
  assigneeId: '1',
  reporterId: '2',
  labels: ['bug', 'frontend'],
  dueDate: new Date('2024-12-31'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockTasks = (count: number): Task[] => {
  const statuses: TaskStatus[] = ['todo', 'in-progress', 'in-review', 'done'];
  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'critical'];
  
  return Array.from({ length: count }, (_, i) =>
    createMockTask({
      id: `${i + 1}`,
      title: `Task ${i + 1}`,
      description: `Description for task ${i + 1}`,
      status: statuses[i % statuses.length],
      priority: priorities[i % priorities.length],
      projectId: `${(i % 3) + 1}`,
      assigneeId: i % 2 === 0 ? `${(i % 3) + 1}` : null,
    })
  );
};
