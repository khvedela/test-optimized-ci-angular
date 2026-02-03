import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="user-list-container">
      <h1>Users</h1>
      <mat-card>
        <mat-card-content>
          <p>User management coming soon...</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
  `],
})
export class UserListComponent {}
