import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from './dialog.service';

describe('DialogService', () => {
  let service: DialogService;
  let mockMatDialog: any;

  beforeEach(() => {
    mockMatDialog = {
      open: jest.fn(),
      closeAll: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useValue: mockMatDialog },
      ],
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have open method', () => {
    expect(service.open).toBeDefined();
  });

  it('should have confirm method', () => {
    expect(service.confirm).toBeDefined();
  });

  it('should have closeAll method', () => {
    expect(service.closeAll).toBeDefined();
  });

  it('should open dialog with default width', () => {
    const mockComponent = class {};
    service.open(mockComponent);
    expect(mockMatDialog.open).toHaveBeenCalledWith(mockComponent, expect.objectContaining({
      width: '600px',
    }));
  });

  it('should call confirm and return observable', (done) => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    service.confirm('Test message').subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });
});
