export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentDto {
  content: string;
  taskId: string;
  mentions?: string[];
}

export interface UpdateCommentDto {
  content: string;
  mentions?: string[];
}

export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}
