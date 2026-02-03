import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '@shared/models';

@Pipe({
  name: 'taskStatus',
})
export class TaskStatusPipe implements PipeTransform {
  transform(status: TaskStatus): string {
    const statusMap: Record<TaskStatus, string> = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'in-review': 'In Review',
      'done': 'Done',
    };
    return statusMap[status] || status;
  }
}
