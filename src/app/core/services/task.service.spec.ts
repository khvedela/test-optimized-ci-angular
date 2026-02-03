import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from '@shared/models';

describe('TaskService (Unit - Mock Data)', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
  });

  describe('Initialization', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with mock tasks', () => {
      expect(service.tasks().length).toBe(10);
    });
  });

  describe('getTasks', () => {
    it('should fetch all tasks', fakeAsync(() => {
      service.getTasks().subscribe((tasks) => {
        expect(tasks.length).toBe(10);
      });

      tick(400);
    }));

    it('should filter tasks by project', fakeAsync(() => {
      const projectId = service.tasks()[0].projectId;

      service.getTasks(projectId).subscribe((tasks) => {
        expect(tasks.every((t) => t.projectId === projectId)).toBe(true);
      });

      tick(400);
    }));
  });

  describe('getTask', () => {
    it('should fetch single task', fakeAsync(() => {
      const taskId = service.tasks()[0].id;

      service.getTask(taskId).subscribe((task) => {
        expect(task.id).toBe(taskId);
      });

      tick(400);
    }));

    it('should handle task not found', fakeAsync(() => {
      service.getTask('non-existent').subscribe({
        error: () => {
          expect(service.error()).toBe('Task not found');
        },
      });

      tick(400);
    }));
  });

  describe('createTask', () => {
    it('should create task successfully', fakeAsync(() => {
      const dto: CreateTaskDto = {
        title: 'New Task',
        description: 'Description',
        priority: 'high',
        projectId: 'proj1',
      };

      service.createTask(dto).subscribe((task) => {
        expect(task.title).toBe(dto.title);
        expect(task.status).toBe('todo');
      });

      tick(400);
    }));
  });

  describe('updateTask', () => {
    it('should update task successfully', fakeAsync(() => {
      const taskId = service.tasks()[0].id;
      const dto: UpdateTaskDto = {
        status: 'done',
        priority: 'low',
      };

      service.updateTask(taskId, dto).subscribe((updated) => {
        expect(updated.status).toBe(dto.status);
        expect(updated.priority).toBe(dto.priority);
      });

      tick(400);
    }));
  });

  describe('deleteTask', () => {
    it('should delete task successfully', fakeAsync(() => {
      const initialCount = service.tasks().length;
      const taskId = service.tasks()[0].id;

      service.deleteTask(taskId).subscribe();
      tick(400);

      expect(service.tasks().length).toBe(initialCount - 1);
    }));
  });
});
