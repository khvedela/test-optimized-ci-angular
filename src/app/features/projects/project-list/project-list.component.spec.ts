import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '@core/services/project.service';
import { createMockProjects } from '@testing/mocks/project.mock';
import { of } from 'rxjs';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let mockProjectService: any;

  beforeEach(async () => {
    const mockProjects = createMockProjects(3);
    mockProjectService = {
      projects: signal(mockProjects).asReadonly(),
      loading: signal(false).asReadonly(),
      error: signal(null).asReadonly(),
      getProjects: jest.fn().mockReturnValue(of(mockProjects)),
      deleteProject: jest.fn().mockReturnValue(of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        provideRouter([]),
        { provide: ProjectService, useValue: mockProjectService },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    expect(mockProjectService.getProjects).toHaveBeenCalled();
  });

  it('should display projects from service', () => {
    expect(component.projectService.projects().length).toBe(3);
  });

  it('should call delete when onDeleteProject is called', fakeAsync(() => {
    const projectId = 'test-id';
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.onDeleteProject(projectId);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockProjectService.deleteProject).toHaveBeenCalledWith(projectId);
  }));

  it('should not delete when user cancels', () => {
    const projectId = 'test-id';
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.onDeleteProject(projectId);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockProjectService.deleteProject).not.toHaveBeenCalled();
  });
});
