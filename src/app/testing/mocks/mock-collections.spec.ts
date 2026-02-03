import { createMockUsers } from './user.mock';
import { createMockComments } from './comment.mock';

describe('Mock Collection Factories', () => {
  describe('createMockUsers', () => {
    it('should create multiple users', () => {
      const users = createMockUsers(5);
      expect(users.length).toBe(5);
    });

    it('should create users with unique ids', () => {
      const users = createMockUsers(3);
      const ids = users.map(u => u.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it('should cycle through roles', () => {
      const users = createMockUsers(5);
      expect(users.some(u => u.role === 'admin')).toBe(true);
      expect(users.some(u => u.role === 'developer')).toBe(true);
    });
  });

  describe('createMockComments', () => {
    it('should create multiple comments', () => {
      const comments = createMockComments(5);
      expect(comments.length).toBe(5);
    });

    it('should create comments with unique ids', () => {
      const comments = createMockComments(3);
      const ids = comments.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it('should create comments with mentions', () => {
      const comments = createMockComments(4);
      const withMentions = comments.filter(c => c.mentions && c.mentions.length > 0);
      expect(withMentions.length).toBeGreaterThan(0);
    });
  });
});
