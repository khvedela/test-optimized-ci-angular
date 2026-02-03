export type NotificationType = 'task_assigned' | 'task_updated' | 'comment_mention' | 'project_invite';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  data: Record<string, any>;
  createdAt: Date;
}

export interface MarkNotificationReadDto {
  notificationId: string;
}
