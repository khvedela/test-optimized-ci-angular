import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with zero statistics', () => {
    expect(component.stats()).toEqual({
      totalProjects: 0,
      activeTasks: 0,
      completedTasks: 0,
      teamMembers: 0,
    });
  });

  it('should load dashboard data on init', fakeAsync(() => {
    component.ngOnInit();
    tick(600);

    expect(component.stats().totalProjects).toBe(12);
    expect(component.stats().activeTasks).toBe(48);
    expect(component.stats().completedTasks).toBe(156);
    expect(component.stats().teamMembers).toBe(24);
  }));

  it('should have positive statistics after loading', fakeAsync(() => {
    component.loadDashboardData();
    tick(600);

    expect(component.stats().totalProjects).toBeGreaterThan(0);
    expect(component.stats().activeTasks).toBeGreaterThan(0);
    expect(component.stats().completedTasks).toBeGreaterThan(0);
    expect(component.stats().teamMembers).toBeGreaterThan(0);
  }));
});
