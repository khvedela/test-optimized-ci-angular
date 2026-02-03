import { TaskStatusPipe } from './task-status.pipe';
import { TaskStatus } from '@shared/models';

describe('TaskStatusPipe (Unit)', () => {
  let pipe: TaskStatusPipe;

  beforeEach(() => {
    // Arrange
    pipe = new TaskStatusPipe();
  });

  it('should create an instance', () => {
    // Assert
    expect(pipe).toBeTruthy();
  });

  it('should transform "todo" to "To Do"', () => {
    // Act
    const result = pipe.transform('todo');

    // Assert
    expect(result).toBe('To Do');
  });

  it('should transform "in-progress" to "In Progress"', () => {
    // Act
    const result = pipe.transform('in-progress');

    // Assert
    expect(result).toBe('In Progress');
  });

  it('should transform "in-review" to "In Review"', () => {
    // Act
    const result = pipe.transform('in-review');

    // Assert
    expect(result).toBe('In Review');
  });

  it('should transform "done" to "Done"', () => {
    // Act
    const result = pipe.transform('done');

    // Assert
    expect(result).toBe('Done');
  });
});
