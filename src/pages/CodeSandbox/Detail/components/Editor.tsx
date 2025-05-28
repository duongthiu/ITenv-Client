import React, { useEffect } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useAppSelector } from '../../../../redux/app/hook';
import { THEME } from '../../../../redux/app/app.slice';
import { Spin, Modal, Typography, Tabs, Image, Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useEditor } from '../hook/use-editor';
import './Editor.style.scss';
import { CodeSandboxFile } from '../../../../types/codesandbox.type';

const { Text } = Typography;

interface EditorProps {
  file: any;
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => void;
  onRequestAccess?: () => void;
  onCompile?: (code: string, lang: string) => Promise<void>;
}

const Editor: React.FC<EditorProps> = ({ file, onContentChange, onSave, onRequestAccess, onCompile }) => {
  const theme = useAppSelector((state) => state.app.theme);

  const {
    openFiles,
    activeFileId,
    isCloseModalVisible,
    isRunning,
    handleFileOpen,
    handleMount,
    handleEditorChange,
    handleEditorDidMount,
    handleClose,
    handleCloseConfirm,
    handleRunCode,
    isLanguageSupported,
    setActiveFileId,
    setIsCloseModalVisible,
    setFileToClose
  } = useEditor({ onContentChange, onSave, onRequestAccess, onCompile });

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
      <div className="flex h-full flex-col">
        <div className="flex-1">
          <MonacoEditor
            key={activeFileId}
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
        </div>
      </div>
    );
  };

  const currentFile = openFiles.find((f) => f._id === activeFileId);
  const showRunButton = currentFile && isLanguageSupported(currentFile.name);

  return (
    <div className="flex h-full w-full flex-col">
      <Tabs
        size="large"
        type="editable-card"
        activeKey={activeFileId || undefined}
        onChange={setActiveFileId}
        hideAdd
        onEdit={(targetKey, action) => {
          if (action === 'remove' && typeof targetKey === 'string') {
            handleClose(targetKey);
          }
        }}
        tabBarExtraContent={
          showRunButton ? (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleRunCode}
              loading={isRunning}
              className="my-2 mr-2 bg-blue-500 hover:bg-blue-600"
            >
              Run
            </Button>
          ) : null
        }
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
