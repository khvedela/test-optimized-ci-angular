import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '@core/services/task.service';
import { createMockTasks } from '@testing/mocks/task.mock';
import { of } from 'rxjs';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: any;

  beforeEach(async () => {
    const mockTasks = createMockTasks(8);
    mockTaskService = {
      tasks: signal(mockTasks).asReadonly(),
      loading: signal(false).asReadonly(),
      error: signal(null).asReadonly(),
      getTasks: jest.fn().mockReturnValue(of(mockTasks)),
    };

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        provideRouter([]),
        { provide: TaskService, useValue: mockTaskService },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(mockTaskService.getTasks).toHaveBeenCalled();
  });

  it('should have computed task filters', () => {
    expect(component.todoTasks).toBeDefined();
    expect(component.inProgressTasks).toBeDefined();
    expect(component.inReviewTasks).toBeDefined();
    expect(component.doneTasks).toBeDefined();
  });

  it('should filter todo tasks correctly', () => {
    const allTasks = mockTaskService.tasks();
    const expectedTodoCount = allTasks.filter((t: any) => t.status === 'todo').length;
    expect(component.todoTasks().length).toBe(expectedTodoCount);
  });

  it('should filter in-progress tasks correctly', () => {
    const allTasks = mockTaskService.tasks();
    const expected = allTasks.filter((t: any) => t.status === 'in-progress').length;
    expect(component.inProgressTasks().length).toBe(expected);
  });

  it('should filter in-review tasks correctly', () => {
    const allTasks = mockTaskService.tasks();
    const expected = allTasks.filter((t: any) => t.status === 'in-review').length;
    expect(component.inReviewTasks().length).toBe(expected);
  });

  it('should filter done tasks correctly', () => {
    const allTasks = mockTaskService.tasks();
    const expected = allTasks.filter((t: any) => t.status === 'done').length;
    expect(component.doneTasks().length).toBe(expected);
  });
});
