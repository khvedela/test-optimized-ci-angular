import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(MatDialog);

  open<T, D = any, R = any>(
    component: ComponentType<T>,
    config?: {
      data?: D;
      width?: string;
      height?: string;
      disableClose?: boolean;
    }
  ): MatDialogRef<T, R> {
    return this.dialog.open(component, {
      width: config?.width || '600px',
      height: config?.height,
      data: config?.data,
      disableClose: config?.disableClose || false,
    });
  }

  confirm(message: string, title: string = 'Confirm'): Observable<boolean> {
    // This would open a confirmation dialog
    // For now, returning a simple observable
    return new Observable((observer) => {
      const result = window.confirm(`${title}: ${message}`);
      observer.next(result);
      observer.complete();
    });
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}
