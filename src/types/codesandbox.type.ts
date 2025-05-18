export enum CodeSandboxFileType {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
  HTML = 'html',
  CSS = 'css',
  JSON = 'json',
  MARKDOWN = 'markdown',
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
  GIF = 'gif',
  SVG = 'svg',
  OTHER = 'other'
}

export enum CodeSandboxStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum CodeSandboxLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
  HTML = 'html',
  CSS = 'css',
  OTHER = 'other'
}

export interface CodeSandboxFile {
  _id: string;
  type: CodeSandboxFileType;
  name: string;
  code?: string;
  version: number;
  sandboxId: string;
  parentFolder?: string | null;
  isImage?: boolean;
  imageUrl?: string;
  imageSize?: number;
  imageMimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CodeSandboxFolder {
  _id: string;
  name: string;
  files: CodeSandboxFile[];
  createdAt: string;
  updatedAt: string;
}

export interface CodeSandboxMember {
  user: CodeSandboxUser;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

export interface CodeSandboxUser {
  _id: string;
  username: string;
  avatar?: string;
}

export interface CodeSandboxType {
  _id: string;
  name: string;
  description: string;
  folders?: CodeSandboxFolder[];
  files?: CodeSandboxFile[];
  version: number;
  createdBy: CodeSandboxUser;
  members: CodeSandboxMember[];
  updatedAt: string;
  createdAt: string;
  isPublic: boolean;
  language: CodeSandboxLanguage[];
  status: CodeSandboxStatus;
}
