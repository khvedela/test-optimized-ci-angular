import { Component, OnInit, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { TaskService } from '@core/services/task.service';
import { TaskStatus } from '@shared/models';
import { TaskPriorityPipe } from '@shared/pipes/task-priority.pipe';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    TaskPriorityPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);

  readonly tasks = this.taskService.tasks;
  readonly loading = this.taskService.loading;
  readonly error = this.taskService.error;

  readonly todoTasks = computed(() => this.tasks().filter((t) => t.status === 'todo'));
  readonly inProgressTasks = computed(() => this.tasks().filter((t) => t.status === 'in-progress'));
  readonly inReviewTasks = computed(() => this.tasks().filter((t) => t.status === 'in-review'));
  readonly doneTasks = computed(() => this.tasks().filter((t) => t.status === 'done'));

  ngOnInit(): void {
    this.taskService.getTasks().subscribe();
  }

  onDeleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe();
    }
  }
}
