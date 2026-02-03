import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto } from '@shared/models';
import { createMockTasks } from '@testing/mocks/task.mock';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Mock data storage
  private mockTasks: Task[] = createMockTasks(10);
  
  private readonly tasksSignal = signal<Task[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly tasks = this.tasksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    // Initialize with mock data
    this.tasksSignal.set(this.mockTasks);
  }

  getTasks(projectId?: string): Observable<Task[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(null).pipe(
      delay(300),
      (obs) => {
        const filteredTasks = projectId
          ? this.mockTasks.filter(t => t.projectId === projectId)
          : this.mockTasks;
        
        this.tasksSignal.set(filteredTasks);
        this.loadingSignal.set(false);
        return of(filteredTasks);
      }
    );
  }

  getTask(id: string): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(null).pipe(
      delay(300),
      (obs) => {
        const task = this.mockTasks.find(t => t.id === id);
        this.loadingSignal.set(false);
        
        if (!task) {
          const errorMessage = 'Task not found';
          this.errorSignal.set(errorMessage);
          return throwError(() => new Error(errorMessage));
        }
        
        return of(task);
      }
    );
  }

  createTask(dto: CreateTaskDto): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(null).pipe(
      delay(300),
      (obs) => {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: dto.title,
          description: dto.description,
          status: 'todo',
          priority: dto.priority || 'medium',
          projectId: dto.projectId,
          assigneeId: dto.assigneeId || null,
          reporterId: 'mock-user-id',
          labels: dto.labels || [],
          dueDate: dto.dueDate || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        this.mockTasks.push(newTask);
        this.tasksSignal.update((tasks) => [...tasks, newTask]);
        this.loadingSignal.set(false);
        return of(newTask);
      }
    );
  }

  updateTask(id: string, dto: UpdateTaskDto): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(null).pipe(
      delay(300),
      (obs) => {
        const index = this.mockTasks.findIndex(t => t.id === id);
        
        if (index === -1) {
          const errorMessage = 'Task not found';
          this.errorSignal.set(errorMessage);
          this.loadingSignal.set(false);
          return throwError(() => new Error(errorMessage));
        }

        const updated: Task = {
          ...this.mockTasks[index],
          ...dto,
          updatedAt: new Date(),
        };

        this.mockTasks[index] = updated;
        this.tasksSignal.update((tasks) => tasks.map((t) => (t.id === id ? updated : t)));
        this.loadingSignal.set(false);
        return of(updated);
      }
    );
  }

  deleteTask(id: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(void 0).pipe(
      delay(300),
      (obs) => {
        this.mockTasks = this.mockTasks.filter((t) => t.id !== id);
        this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id));
        this.loadingSignal.set(false);
        return obs;
      }
    );
  }
}
