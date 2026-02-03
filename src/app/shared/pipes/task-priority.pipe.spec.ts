import { TaskPriorityPipe } from './task-priority.pipe';

describe('TaskPriorityPipe', () => {
  let pipe: TaskPriorityPipe;

  beforeEach(() => {
    pipe = new TaskPriorityPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform low priority', () => {
    expect(pipe.transform('low')).toBe('Low');
  });

  it('should transform medium priority', () => {
    expect(pipe.transform('medium')).toBe('Medium');
  });

  it('should transform high priority', () => {
    expect(pipe.transform('high')).toBe('High');
  });

  it('should transform critical priority', () => {
    expect(pipe.transform('critical')).toBe('Critical');
  });

  it('should handle unknown priority', () => {
    expect(pipe.transform('unknown' as any)).toBe('unknown');
  });
});
