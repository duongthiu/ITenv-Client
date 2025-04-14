import { Modal } from 'antd';
import { Editor, Monaco } from '@monaco-editor/react';
import { useAppSelector } from '../../../../../redux/app/hook';
import { THEME } from '../../../../../redux/app/app.slice';
import { useState, useEffect } from 'react';
import { getFileIcon, getLanguageFromExtension } from '../../../../../utils/icons/fileIcons';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (content: string) => void;
  fileContent: string;
  fileName: string;
}

const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, onSend, fileContent, fileName }) => {
  const theme = useAppSelector((state) => state.app.theme);
  const [code, setCode] = useState(fileContent);

  useEffect(() => {
    setCode(fileContent);
  }, [fileContent]);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    // Configure the editor
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Add basic JavaScript/TypeScript type definitions
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      `
      declare class Console {
        log(...data: any[]): void;
        error(...data: any[]): void;
        warn(...data: any[]): void;
      }
      declare const console: Console;
      
      interface Window {
        document: Document;
      }
      declare const window: Window;
      `,
      'global.d.ts'
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {getFileIcon(fileName)}
          <span>{fileName}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={800}
      onOk={() => onSend(code)}
      okText="Send"
    >
      <div style={{ height: '60vh' }}>
        <Editor
          height="100%"
          width="100%"
          theme={theme === THEME.DARK ? 'vs-dark' : 'light'}
          language={getLanguageFromExtension(fileName)}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            snippetSuggestions: 'inline',
            formatOnType: true,
            formatOnPaste: true,
            autoIndent: 'full',
            tabSize: 2,
            scrollBeyondLastLine: false,
            automaticLayout: true
          }}
        />
      </div>
    </Modal>
  );
};

export default CodeModal;
