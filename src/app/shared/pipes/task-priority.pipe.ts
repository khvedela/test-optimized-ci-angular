import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '@shared/models';

@Pipe({
  name: 'taskPriority',
})
export class TaskPriorityPipe implements PipeTransform {
  transform(priority: TaskPriority): string {
    const priorityMap: Record<TaskPriority, string> = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'critical': 'Critical',
    };
    return priorityMap[priority] || priority;
  }
}
