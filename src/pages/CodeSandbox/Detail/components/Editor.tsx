import React, { useEffect } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useAppSelector } from '../../../../redux/app/hook';
import { THEME } from '../../../../redux/app/app.slice';
import { Spin, Modal, Typography, Tabs, Image } from 'antd';
import { useEditor } from '../hook/use-editor';
import './Editor.style.scss';
import { CodeSandboxFile } from '../../../../types/codesandbox.type';

const { Text } = Typography;

interface EditorProps {
  file: any;
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ file, onContentChange, onSave }) => {
  const theme = useAppSelector((state) => state.app.theme);
  const {
    openFiles,
    activeFileId,
    isCloseModalVisible,

    handleFileOpen,
    handleMount,
    handleEditorChange,
    handleEditorDidMount,
    handleClose,
    handleCloseConfirm,
    setActiveFileId,
    setIsCloseModalVisible,
    setFileToClose
  } = useEditor({ onContentChange, onSave });

  useEffect(() => {
    handleFileOpen(file);
  }, [file]);

  const renderFileContent = (file: CodeSandboxFile) => {
    if (file?.isImage) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-white p-4">
          <Image
            src={file.imageUrl || 'temp'}
            alt={file.name}
            className="max-h-full max-w-full object-contain"
            preview={false}
          />
        </div>
      );
    }
    return (
      <MonacoEditor
        theme={theme === THEME.DARK ? 'OneDarkPro' : 'light'}
        width="100%"
        height="100%"
        className="absolute h-full"
        language={file.type}
        value={file.code}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true
        }}
        beforeMount={handleEditorDidMount}
        onMount={handleMount}
        onChange={handleEditorChange}
        loading={<Spin />}
      />
    );
  };

  return (
    <div className="flex h-full w-full flex-col">
      <Tabs
        type="editable-card"
        activeKey={activeFileId || undefined}
        onChange={setActiveFileId}
        hideAdd
        onEdit={(targetKey, action) => {
          if (action === 'remove' && typeof targetKey === 'string') {
            handleClose(targetKey);
          }
        }}
        items={openFiles.map((file) => ({
          key: file._id,
          label: (
            <div className="flex items-center gap-2">
              <Text className="text-sm">{file.name}</Text>
              {file.hasUnsavedChanges && <span className="text-xs text-gray-500">•</span>}
            </div>
          ),
          closable: true,
          children: <div className="h-full">{renderFileContent(file)}</div>
        }))}
        className="editor-tabs h-full"
      />

      <Modal
        title="Unsaved Changes"
        open={isCloseModalVisible}
        onOk={handleCloseConfirm}
        onCancel={() => {
          setIsCloseModalVisible(false);
          setFileToClose(null);
        }}
        okText="Close without saving"
        cancelText="Cancel"
      >
        <p>You have unsaved changes. Are you sure you want to close this file?</p>
      </Modal>
    </div>
  );
};

export default Editor;
