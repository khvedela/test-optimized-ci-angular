import { createMockComment } from './comment.mock';
import { createMockUser } from './user.mock';

describe('Mock Factories', () => {
  describe('createMockComment', () => {
    it('should create a comment with default values', () => {
      const comment = createMockComment();
      expect(comment).toBeDefined();
      expect(comment.id).toBeTruthy();
      expect(comment.content).toBe('This is a test comment');
      expect(comment.authorId).toBe('1');
      expect(comment.taskId).toBe('1');
      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(comment.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a comment with overrides', () => {
      const comment = createMockComment({
        content: 'Custom content',
        authorId: 'custom-user',
      });
      expect(comment.content).toBe('Custom content');
      expect(comment.authorId).toBe('custom-user');
    });
  });

  describe('createMockUser', () => {
    it('should create a user with default values', () => {
      const user = createMockUser();
      expect(user).toBeDefined();
      expect(user.id).toBeTruthy();
      expect(user.email).toBe('test@example.com');
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.role).toBe('developer');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with overrides', () => {
      const user = createMockUser({
        email: 'custom@test.com',
        firstName: 'Jane',
        role: 'admin',
      });
      expect(user.email).toBe('custom@test.com');
      expect(user.firstName).toBe('Jane');
      expect(user.role).toBe('admin');
    });

    it('should create an admin user', () => {
      const user = createMockUser({ role: 'admin' });
      expect(user.role).toBe('admin');
    });
  });
});
