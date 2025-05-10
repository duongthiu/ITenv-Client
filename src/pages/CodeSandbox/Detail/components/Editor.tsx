import React, { useEffect, useRef, useState } from 'react';
import { Monaco, Editor as MonacoEditor } from '@monaco-editor/react';
import { useAppSelector } from '../../../../redux/app/hook';
import { THEME } from '../../../../redux/app/app.slice';

interface EditorProps {
  file: any;
}

const Editor: React.FC<EditorProps> = ({ file }) => {
  const [code, setCode] = useState<string>(file?.code || '');
  useEffect(() => {
    setCode(file?.code || '');
  }, [file]);
  const theme = useAppSelector((state) => state.app.theme);
  const editorRef = useRef(null);
  const handleMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChange = (newValue: any) => {
    setCode(newValue);
  };
  const handleEditorDidMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('OneDarkPro', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ token: '', foreground: 'ffffff', background: '282828' }],
      colors: {
        'editor.background': '#282828'
      }
    });
  };
  return file ? (
    <MonacoEditor
      theme={theme === THEME.DARK ? 'OneDarkPro' : 'light'}
      width="100%"
      height="100%"
      language={file.type}
      value={code}
      options={{ fontSize: 14 }}
      beforeMount={handleEditorDidMount}
      onMount={handleMount}
      onChange={handleChange}
    />
  ) : (
    <div className="mt-20 text-center text-gray-400">Select a file to view/edit</div>
  );
};

export default Editor;
