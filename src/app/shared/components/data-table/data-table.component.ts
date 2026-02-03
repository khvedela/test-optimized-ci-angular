import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-data-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="data()" matSort (matSortChange)="sortChange.emit($event)">
        @for (column of columns(); track column.key) {
          <ng-container [matColumnDef]="column.key">
            <th mat-header-cell *matHeaderCellDef [mat-sort-header]="column.sortable !== false ? column.key : ''">
              {{ column.label }}
            </th>
            <td mat-cell *matCellDef="let row">
              {{ row[column.key] }}
            </td>
          </ng-container>
        }

        @if (actions()) {
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button (click)="rowAction.emit({ action: 'edit', row })">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="rowAction.emit({ action: 'delete', row })">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns()" (click)="rowClick.emit(row)"></tr>
      </table>

      @if (paginator()) {
        <mat-paginator
          [length]="totalItems()"
          [pageSize]="pageSize()"
          [pageSizeOptions]="pageSizeOptions()"
          (page)="pageChange.emit($event)"
        ></mat-paginator>
      }
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
      overflow: auto;
    }

    table {
      width: 100%;
    }

    tr.mat-row:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
  `],
})
export class DataTableComponent {
  readonly data = input.required<any[]>();
  readonly columns = input.required<TableColumn[]>();
  readonly actions = input<boolean>(false);
  readonly paginator = input<boolean>(true);
  readonly totalItems = input<number>(0);
  readonly pageSize = input<number>(10);
  readonly pageSizeOptions = input<number[]>([5, 10, 25, 50]);

  readonly rowClick = output<any>();
  readonly rowAction = output<{ action: string; row: any }>();
  readonly sortChange = output<Sort>();
  readonly pageChange = output<PageEvent>();

  readonly displayedColumns = input.required<string[]>();
}
