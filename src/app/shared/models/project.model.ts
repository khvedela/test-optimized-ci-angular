export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  memberIds?: string[];
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  memberIds?: string[];
}

export interface ProjectWithMembers extends Project {
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}
