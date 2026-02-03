import { Comment } from '@shared/models';

export const createMockComment = (overrides?: Partial<Comment>): Comment => ({
  id: '1',
  content: 'This is a test comment',
  taskId: '1',
  authorId: '1',
  mentions: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockComments = (count: number): Comment[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockComment({
      id: `${i + 1}`,
      content: `Comment ${i + 1}`,
      taskId: `${(i % 3) + 1}`,
      authorId: `${(i % 3) + 1}`,
      mentions: i % 2 === 0 ? [`${(i % 3) + 2}`] : [],
    })
  );
};
