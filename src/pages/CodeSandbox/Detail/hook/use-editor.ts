import { useState, useRef, useEffect } from 'react';
import { Monaco } from '@monaco-editor/react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { updateFileInSandbox } from '../../../../services/codesanbox/codesandbox.service';
import { CodeSandboxFile } from '../../../../types/codesandbox.type';

export interface EditorFile extends CodeSandboxFile {
  hasUnsavedChanges: boolean;
  originalCode: string;
}

interface UseEditorProps {
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => void;
}

export const useEditor = ({ onContentChange, onSave }: UseEditorProps = {}) => {
  const [openFiles, setOpenFiles] = useState<EditorFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isCloseModalVisible, setIsCloseModalVisible] = useState(false);
  const [fileToClose, setFileToClose] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const { id: sandboxId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle file selection from URL
  useEffect(() => {
    const fileId = searchParams.get('file');
    if (fileId && fileId !== activeFileId) {
      setActiveFileId(fileId);
    }
  }, [searchParams]);

  // Update URL when active file changes
  useEffect(() => {
    if (activeFileId) {
      navigate(`?file=${activeFileId}`, { replace: true });
    } else {
      navigate(`?`, { replace: true });
    }
  }, [activeFileId, navigate]);

  const handleFileOpen = (file: CodeSandboxFile) => {
    if (file) {
      setOpenFiles((prev) => {
        const exists = prev.some((f) => f._id === file._id);
        if (!exists) {
          return [
            ...prev,
            {
              ...file,
              hasUnsavedChanges: false,
              originalCode: file.code || ''
            }
          ];
        }
        return prev;
      });
      setActiveFileId(file._id);
    }
  };

  const handleMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();

    // Add save action with Ctrl+S shortcut
    editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [monacoRef.current?.KeyMod.CtrlCmd | monacoRef.current?.KeyCode.KeyS],
      run: () => {
        handleSave();
        return null;
      }
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFileId) {
      setOpenFiles((prev) =>
        prev.map((f) => {
          if (f._id === activeFileId) {
            const currentFile = prev.find((file) => file._id === activeFileId);
            return {
              ...f,
              code: value,
              hasUnsavedChanges: value !== currentFile?.originalCode
            };
          }
          return f;
        })
      );
      onContentChange?.(value);
    }
  };

  const handleEditorDidMount = (monaco: Monaco) => {
    monacoRef.current = monaco;
    monaco.editor.defineTheme('OneDarkPro', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ token: '', foreground: 'ffffff', background: '282828' }],
      colors: {
        'editor.background': '#282828'
      }
    });
  };

  const handleSave = async () => {
    if (editorRef.current && activeFileId && sandboxId) {
      setIsSaving(true);
      try {
        const currentValue = editorRef.current.getValue();
        const currentFile = openFiles.find((f) => f._id === activeFileId);
        if (!currentFile) return;

        await updateFileInSandbox(sandboxId, activeFileId, {
          code: currentValue
        });

        setOpenFiles((prev) =>
          prev.map((f) =>
            f._id === activeFileId
              ? { ...f, code: currentValue, hasUnsavedChanges: false, originalCode: currentValue }
              : f
          )
        );
        onSave?.(currentValue);
        message.success('File saved successfully');
      } catch (error: any) {
        message.error(error.response.data.message || 'Failed to save file');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleClose = (fileId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const fileToClose = openFiles.find((f) => f._id === fileId);
    if (fileToClose?.hasUnsavedChanges) {
      setFileToClose(fileId);
      setIsCloseModalVisible(true);
    } else {
      closeFile(fileId);
    }
  };

  const closeFile = (fileId: string) => {
    setOpenFiles((prev) => prev.filter((f) => f._id !== fileId));
    if (activeFileId === fileId) {
      const remainingFiles = openFiles.filter((f) => f._id !== fileId);
      setActiveFileId(remainingFiles?.length > 0 ? remainingFiles[remainingFiles.length - 1]._id : null);
    }
  };

  const handleCloseConfirm = () => {
    if (fileToClose) {
      closeFile(fileToClose);
      setFileToClose(null);
    }
    setIsCloseModalVisible(false);
  };

  return {
    openFiles,
    activeFileId,
    isCloseModalVisible,
    fileToClose,
    isSaving,
    editorRef,
    monacoRef,
    handleFileOpen,
    handleMount,
    handleEditorChange,
    handleEditorDidMount,
    handleSave,
    handleClose,
    handleCloseConfirm,
    setActiveFileId,
    setIsCloseModalVisible,
    setFileToClose
  };
};
