import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from '@shared/models';

describe('ProjectService (Unit - Mock Data)', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService],
    });
    service = TestBed.inject(ProjectService);
  });

  describe('Initialization', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with mock projects', () => {
      expect(service.projects().length).toBeGreaterThanOrEqual(5);
    });

    it('should not be loading initially', () => {
      expect(service.loading()).toBe(false);
    });

    it('should have no error initially', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('getProjects', () => {
    it('should fetch projects successfully', fakeAsync(() => {
      service.getProjects().subscribe((projects) => {
        expect(projects.length).toBeGreaterThanOrEqual(5);
        expect(projects[0]).toHaveProperty('name');
        expect(projects[0]).toHaveProperty('status');
      });

      tick(400);
      expect(service.loading()).toBe(false);
    }));

    it('should update projects signal', fakeAsync(() => {
      service.getProjects().subscribe();
      tick(400);

      expect(service.projects().length).toBeGreaterThanOrEqual(5);
    }));
  });

  describe('getProject', () => {
    it('should fetch single project successfully', fakeAsync(() => {
      const projectId = service.projects()[0].id;

      service.getProject(projectId).subscribe((project) => {
        expect(project.id).toBe(projectId);
      });

      tick(400);
    }));

    it('should handle project not found error', fakeAsync(() => {
      service.getProject('non-existent').subscribe({
        error: (error) => {
          expect(service.error()).toBe('Project not found');
        },
      });

      tick(400);
    }));
  });

  describe('createProject', () => {
    it('should create project successfully', fakeAsync(() => {
      const initialCount = service.projects().length;
      const dto: CreateProjectDto = {
        name: 'New Project',
        description: 'Test Description',
        memberIds: ['user1'],
      };

      service.createProject(dto).subscribe((project) => {
        expect(project.name).toBe(dto.name);
        expect(project.description).toBe(dto.description);
        expect(project.status).toBe('active');
      });

      tick(400);

      expect(service.projects().length).toBeGreaterThan(initialCount);
    }));

    it('should add created project to projects signal', fakeAsync(() => {
      const initialCount = service.projects().length;
      const dto: CreateProjectDto = {
        name: 'Another Project',
        description: 'Description',
      };

      service.createProject(dto).subscribe();
      tick(400);

      expect(service.projects().length).toBeGreaterThan(initialCount);
    }));
  });

  describe('updateProject', () => {
    it('should update project successfully', fakeAsync(() => {
      const projectId = service.projects()[0].id;
      const dto: UpdateProjectDto = {
        name: 'Updated Name',
        status: 'completed',
      };

      service.updateProject(projectId, dto).subscribe((updated) => {
        expect(updated.name).toBe(dto.name);
        expect(updated.status).toBe(dto.status);
      });

      tick(400);
    }));

    it('should handle update for non-existent project', fakeAsync(() => {
      const dto: UpdateProjectDto = { name: 'Updated' };

      service.updateProject('non-existent', dto).subscribe({
        error: () => {
          expect(service.error()).toBe('Project not found');
        },
      });

      tick(400);
    }));
  });

  describe('deleteProject', () => {
    it('should delete project successfully', fakeAsync(() => {
      const initialCount = service.projects().length;
      const projectId = service.projects()[0].id;

      service.deleteProject(projectId).subscribe();
      tick(400);

      expect(service.projects().length).toBe(initialCount - 1);
    }));

    it('should remove project from signal', fakeAsync(() => {
      const projectId = service.projects()[0].id;

      service.deleteProject(projectId).subscribe();
      tick(400);

      const found = service.projects().find((p) => p.id === projectId);
      expect(found).toBeUndefined();
    }));
  });
});
