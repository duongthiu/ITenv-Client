import { DiJavascript1, DiPython, DiJava, DiCss3, DiHtml5, DiReact, DiPhp } from 'react-icons/di';
import { SiTypescript, SiCplusplus, SiCsharp, SiRuby, SiSwift, SiKotlin, SiGo } from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import { ReactElement } from 'react';

export const getFileIcon = (fileName: string | undefined): ReactElement => {
  if (!fileName) return <VscCode size={20} />;

  const extension = fileName.split('.').pop()?.toLowerCase();
  const iconProps = { size: 20 };

  switch (extension) {
    case 'js':
      return <DiJavascript1 {...iconProps} className="text-yellow-400" />;
    case 'ts':
    case 'tsx':
      return <SiTypescript {...iconProps} className="text-blue-400" />;
    case 'py':
      return <DiPython {...iconProps} className="text-blue-500" />;
    case 'java':
      return <DiJava {...iconProps} className="text-red-500" />;
    case 'cpp':
    case 'c':
      return <SiCplusplus {...iconProps} className="text-blue-600" />;
    case 'cs':
      return <SiCsharp {...iconProps} className="text-purple-500" />;
    case 'php':
      return <DiPhp {...iconProps} className="text-purple-400" />;
    case 'rb':
      return <SiRuby {...iconProps} className="text-red-600" />;
    case 'swift':
      return <SiSwift {...iconProps} className="text-orange-500" />;
    case 'kt':
      return <SiKotlin {...iconProps} className="text-orange-400" />;
    case 'go':
      return <SiGo {...iconProps} className="text-blue-400" />;
    case 'css':
      return <DiCss3 {...iconProps} className="text-blue-500" />;
    case 'html':
      return <DiHtml5 {...iconProps} className="text-orange-500" />;
    case 'jsx':
    case 'react':
      return <DiReact {...iconProps} className="text-blue-400" />;
    default:
      return <VscCode className="text-gray-500" {...iconProps} />;
  }
};

export const getLanguageFromExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const languageMap: { [key: string]: string } = {
    js: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    rb: 'ruby',
    swift: 'swift',
    kt: 'kotlin',
    go: 'go',
    css: 'css',
    html: 'html',
    jsx: 'javascript'
  };
  return languageMap[extension || ''] || 'plaintext';
};
