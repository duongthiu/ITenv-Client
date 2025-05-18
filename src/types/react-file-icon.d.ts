declare module 'react-file-icon' {
  export const FileIcon: React.FC<{
    extension: string;
    size?: number;
    [key: string]: any;
  }>;
  export const defaultStyles: Record<string, any>;
}
