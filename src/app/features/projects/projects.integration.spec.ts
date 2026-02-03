import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { TaskService } from '@core/services/task.service';
import { AuthService } from '@core/services/auth.service';

describe('Project and Task Management Integration', () => {
  let projectService: ProjectService;
  let taskService: TaskService;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        ProjectService,
        TaskService,
        AuthService,
      ],
    });

    projectService = TestBed.inject(ProjectService);
    taskService = TestBed.inject(TaskService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    
    // Prevent actual navigation during tests
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  describe('End-to-End Project and Task Flow', () => {
    it('should create project, add tasks, and complete workflow', fakeAsync(() => {
      // Step 1: Login
      authService.login({ email: 'admin@example.com', password: 'password123' }).subscribe();
      tick(600);
      expect(authService.isAuthenticated()).toBe(true);

      // Step 2: Load initial data
      const initialProjectCount = projectService.projects().length;
      const initialTaskCount = taskService.tasks().length;

      // Step 3: Create a new project
      const newProject = {
        name: 'Integration Test Project',
        description: 'Testing end-to-end flow',
      };

      let createdProjectId: string;
      projectService.createProject(newProject).subscribe((project) => {
        createdProjectId = project.id;
        expect(project.name).toBe(newProject.name);
      });
      tick(400);

      expect(projectService.projects().length).toBeGreaterThan(initialProjectCount);

      // Step 4: Create tasks for the project
      const task1 = {
        title: 'Task 1',
        description: 'First task',
        priority: 'high' as const,
        projectId: createdProjectId,
      };

      const task2 = {
        title: 'Task 2',
        description: 'Second task',
        priority: 'medium' as const,
        projectId: createdProjectId,
      };

      taskService.createTask(task1).subscribe();
      tick(400);
      taskService.createTask(task2).subscribe();
      tick(400);

      expect(taskService.tasks().length).toBeGreaterThan(initialTaskCount);

      // Step 5: Verify tasks belong to project
      const projectTasks = taskService.tasks().filter((t) => t.projectId === createdProjectId);
      expect(projectTasks.length).toBeGreaterThanOrEqual(2);

      // Step 6: Update task status
      const taskToUpdate = projectTasks[0];
      taskService.updateTask(taskToUpdate.id, { status: 'done' }).subscribe();
      tick(400);

      const updatedTask = taskService.tasks().find((t) => t.id === taskToUpdate.id);
      expect(updatedTask?.status).toBe('done');

      // Step 7: Delete project
      projectService.deleteProject(createdProjectId).subscribe();
      tick(400);

      const projectStillExists = projectService
        .projects()
        .some((p) => p.id === createdProjectId);
      expect(projectStillExists).toBe(false);
    }));

    it('should filter tasks by project correctly', fakeAsync(() => {
      const projectId = projectService.projects()[0]?.id;
      expect(projectId).toBeDefined();

      taskService.getTasks(projectId).subscribe((tasks) => {
        expect(tasks.every((t) => t.projectId === projectId)).toBe(true);
      });
      tick(400);
    }));

    it('should handle concurrent operations', fakeAsync(() => {
      const initialCount = projectService.projects().length;

      // Create multiple projects simultaneously
      projectService.createProject({ name: 'Project A', description: 'Test A' }).subscribe();
      projectService.createProject({ name: 'Project B', description: 'Test B' }).subscribe();
      projectService.createProject({ name: 'Project C', description: 'Test C' }).subscribe();

      tick(500);

      expect(projectService.projects().length).toBeGreaterThan(initialCount);
    }));
  });

  describe('Error Handling Integration', () => {
    it('should handle non-existent project gracefully', fakeAsync(() => {
      let errorOccurred = false;

      projectService.getProject('non-existent-id').subscribe({
        error: () => {
          errorOccurred = true;
        },
      });
      tick(400);

      expect(errorOccurred).toBe(true);
      expect(projectService.error()).toBe('Project not found');
    }));

    it('should handle non-existent task gracefully', fakeAsync(() => {
      let errorOccurred = false;

      taskService.getTask('non-existent-id').subscribe({
        error: () => {
          errorOccurred = true;
        },
      });
      tick(400);

      expect(errorOccurred).toBe(true);
      expect(taskService.error()).toBe('Task not found');
    }));
  });
});
