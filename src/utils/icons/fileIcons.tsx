import { DiReact, DiPhp } from 'react-icons/di';
import { SiCsharp, SiRuby, SiSwift, SiKotlin, SiGo } from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import { ReactElement } from 'react';
import { FaFolder, FaFileImage } from 'react-icons/fa';

// Import custom language icons
import htmlIcon from '../../assets/lang-icons/icons8-html5-48.png';
import jsIcon from '../../assets/lang-icons/icons8-javascript-48.png';
import typescriptIcon from '../../assets/lang-icons/icons8-typescript-48.png';
import pythonIcon from '../../assets/lang-icons/icons8-python-48.png';
import javaIcon from '../../assets/lang-icons/icons8-java-48.png';
import cppIcon from '../../assets/lang-icons/icons8-cpp-64.png';
import cssIcon from '../../assets/lang-icons/icons8-css-48.png';

export const getFileIcon = (fileName: string | undefined): ReactElement => {
  if (!fileName) return <VscCode size={20} />;

  const extension = fileName.split('.').pop()?.toLowerCase();
  const iconProps = { size: 20 };

  switch (extension) {
    case 'js':
      return <img src={jsIcon} alt="JavaScript" className="h-5 w-5" {...iconProps} />;
    case 'ts':
    case 'tsx':
      return <img src={typescriptIcon} alt="TypeScript" className="h-5 w-5" {...iconProps} />;
    case 'py':
      return <img src={pythonIcon} alt="Python" className="h-5 w-5" {...iconProps} />;
    case 'java':
      return <img src={javaIcon} alt="Java" className="h-5 w-5" {...iconProps} />;
    case 'cpp':
    case 'c':
      return <img src={cppIcon} alt="C++" className="h-5 w-5" {...iconProps} />;
    case 'css':
      return <img src={cssIcon} alt="CSS" className="h-5 w-5" {...iconProps} />;
    case 'html':
      return <img src={htmlIcon} alt="HTML" className="h-5 w-5" {...iconProps} />;
    // Fallback to React icons for other languages
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
    case 'jsx':
    case 'react':
      return <img src={typescriptIcon} alt="TypeScript" className="h-5 w-5" {...iconProps} />;
    // Image file types
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <FaFileImage {...iconProps} className="text-green-500" />;
    default:
      return <VscCode className="text-gray-500" {...iconProps} />;
  }
};

export const FolderIcon = (props: any) => {
  return <FaFolder {...props} className="text-yellow-400" />;
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
    jsx: 'javascript',
    // Image file types
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    svg: 'image'
  };
  return languageMap[extension || ''] || 'plaintext';
};
