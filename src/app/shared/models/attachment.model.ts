export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  taskId: string;
  uploadedById: string;
  url: string;
  createdAt: Date;
}

export interface UploadAttachmentDto {
  file: File;
  taskId: string;
}
