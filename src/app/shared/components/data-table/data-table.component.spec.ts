import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    
    // Set all required input signals
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('columns', []);
    fixture.componentRef.setInput('displayedColumns', []);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle empty data', () => {
    expect(component.data().length).toBe(0);
  });

  it('should handle data with columns', () => {
    fixture.componentRef.setInput('data', [{ id: 1, name: 'Test' }]);
    fixture.componentRef.setInput('columns', [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }]);
    fixture.componentRef.setInput('displayedColumns', ['id', 'name']);
    fixture.detectChanges();
    
    expect(component.data().length).toBe(1);
    expect(component.columns().length).toBe(2);
    expect(component.displayedColumns().length).toBe(2);
  });
});
