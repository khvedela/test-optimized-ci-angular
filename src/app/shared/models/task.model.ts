export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  reporterId: string;
  labels: string[];
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  projectId: string;
  assigneeId?: string;
  labels?: string[];
  dueDate?: Date;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  labels?: string[];
  dueDate?: Date | null;
}

export interface TaskWithDetails extends Task {
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  reporter: {
    id: string;
    name: string;
    avatar?: string;
  };
  project: {
    id: string;
    name: string;
  };
  commentsCount: number;
  attachmentsCount: number;
}
