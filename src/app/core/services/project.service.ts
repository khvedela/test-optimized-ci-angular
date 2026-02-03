import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { Project, CreateProjectDto, UpdateProjectDto } from '@shared/models';
import { createMockProjects } from '@testing/mocks/project.mock';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // Mock data storage
  private mockProjects: Project[] = createMockProjects(5);
  
  private readonly projectsSignal = signal<Project[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly projects = this.projectsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    // Initialize with mock data
    this.projectsSignal.set(this.mockProjects);
  }

  getProjects(): Observable<Project[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(this.mockProjects).pipe(
      delay(300),
      (obs) => {
        this.projectsSignal.set(this.mockProjects);
        this.loadingSignal.set(false);
        return obs;
      }
    );
  }

  getProject(id: string): Observable<Project> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(null).pipe(
      delay(300),
      (obs) => {
        const project = this.mockProjects.find(p => p.id === id);
        this.loadingSignal.set(false);
        
        if (!project) {
          const errorMessage = 'Project not found';
          this.errorSignal.set(errorMessage);
          return throwError(() => new Error(errorMessage));
        }
        
        return of(project);
      }
    );
  }

  createProject(dto: CreateProjectDto): Observable<Project> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(null).pipe(
      delay(300),
      (obs) => {
        const newProject: Project = {
          id: `proj-${Date.now()}`,
          name: dto.name,
          description: dto.description,
          status: 'active',
          ownerId: 'mock-user-id',
          memberIds: dto.memberIds || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        this.mockProjects.push(newProject);
        this.projectsSignal.update((projects) => [...projects, newProject]);
        this.loadingSignal.set(false);
        return of(newProject);
      }
    );
  }

  updateProject(id: string, dto: UpdateProjectDto): Observable<Project> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(null).pipe(
      delay(300),
      (obs) => {
        const index = this.mockProjects.findIndex(p => p.id === id);
        
        if (index === -1) {
          const errorMessage = 'Project not found';
          this.errorSignal.set(errorMessage);
          this.loadingSignal.set(false);
          return throwError(() => new Error(errorMessage));
        }

        const updated: Project = {
          ...this.mockProjects[index],
          ...dto,
          updatedAt: new Date(),
        };

        this.mockProjects[index] = updated;
        this.projectsSignal.update((projects) =>
          projects.map((p) => (p.id === id ? updated : p))
        );
        this.loadingSignal.set(false);
        return of(updated);
      }
    );
  }

  deleteProject(id: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulate API delay
    return of(void 0).pipe(
      delay(300),
      (obs) => {
        this.mockProjects = this.mockProjects.filter((p) => p.id !== id);
        this.projectsSignal.update((projects) => projects.filter((p) => p.id !== id));
        this.loadingSignal.set(false);
        return obs;
      }
    );
  }
}
