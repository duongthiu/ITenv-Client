export const getLanguageFromFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'js':
      return 'javascript';
    case 'jsx':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'c':
      return 'c';
    case 'cpp':
      return 'cpp';
    case 'cs':
      return 'csharp';
    case 'go':
      return 'go';
    case 'rs':
      return 'rust';
    case 'php':
      return 'php';
    case 'rb':
      return 'ruby';
    case 'swift':
      return 'swift';
    case 'kt':
      return 'kotlin';
    case 'scala':
      return 'scala';
    case 'sh':
      return 'shell';
    case 'sql':
      return 'sql';
    case 'xml':
      return 'xml';
    case 'yaml':
    case 'yml':
      return 'yaml';
    default:
      return 'plaintext';
  }
};
