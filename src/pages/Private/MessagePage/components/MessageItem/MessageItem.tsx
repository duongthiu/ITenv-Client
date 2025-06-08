import { Avatar, Button, Image, Popover, Tooltip, Modal, Typography } from 'antd';
import { Editor } from '@monaco-editor/react';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { MessageType } from '../../../../../types/ConversationType';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { recallMessage, sendMessage } from '../../../../../services/message/message.service';
import { useSocket } from '../../../../../context/SocketContext';
import { paths } from '../../../../../routes/paths';
import { useNavigate } from 'react-router-dom';
import { recallMessageAction, addMessageToMessageList } from '../../../../../redux/message/message.slice';
import { getFileIcon, getLanguageFromExtension } from '../../../../../utils/icons/fileIcons';
import { THEME } from '../../../../../redux/app/app.slice';
import { Monaco } from '@monaco-editor/react';
import { DownloadOutlined, SendOutlined, EditOutlined } from '@ant-design/icons';
import { notifyError } from '../../../../../utils/helpers/notify';
import { ResponsePagination } from '../../../../../types/common';

type MessageItemProps = {
  message: MessageType;
};

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const socket = useSocket();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const theme = useAppSelector((state) => state.app.theme);
  const [editableCode, setEditableCode] = useState(message.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  const handleRecall = async () => {
    try {
      const response = await recallMessage(message?._id || '');
      if (response.success) {
        dispatch(recallMessageAction(message));
        if (socket) {
          socket.emit('recall_message', { ...message, isRecalled: true });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const popoverContent = (
    <div className="flex flex-col gap-2">
      <Button
        className="flex w-full justify-start text-start hover:bg-primary-color hover:text-white"
        type="text"
        onClick={handleRecall}
      >
        Recall
      </Button>
    </div>
  );

  const handleEditorDidMount = (_: any, monaco: Monaco) => {
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

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([message.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = message.fileName || 'code.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSendCode = async () => {
    try {
      if (socket) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('content', editableCode);
        formData.append('hasText', 'true');
        formData.append('hasFile', 'false');
        formData.append('hasCodeFile', 'true');
        formData.append('conversationId', message.conversationId);
        formData.append('fileName', message.fileName || 'code.txt');
        formData.append('isSeenBy', JSON.stringify([user?._id]));

        const response: ResponsePagination<MessageType> = await sendMessage(formData);

        if (response?.success) {
          socket.emit('message', response.data);
          dispatch(addMessageToMessageList(response.data!));
        } else {
          notifyError(response?.message || 'Failed to send code');
        }
      }
    } catch (error) {
      notifyError((error as any).response.data.message);
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsCodeModalOpen(false);
      setIsEditing(false);
    }
  };

  const renderCodeMessage = () => {
    return (
      <div
        onClick={() => setIsCodeModalOpen(true)}
        className="cursor-pointer rounded-2xl bg-white bg-none px-4 py-3 !text-black shadow-md"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {getFileIcon(message.fileName)}
            <span className="text-[14px] font-semibold">{message.fileName || 'Untitled Code'}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderCodeModal = () => {
    return (
      <Modal
        title={
          <div className="flex items-center gap-2">
            {getFileIcon(message.fileName)}
            <span className="text-[14px] font-semibold">{message.fileName || 'Untitled Code'}</span>
          </div>
        }
        open={isCodeModalOpen}
        onCancel={() => {
          setIsCodeModalOpen(false);
          setIsEditing(false);
          setEditableCode(message.content);
        }}
        width={800}
        footer={
          <div className="flex justify-between">
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsEditing(!isEditing)}
              type={isEditing ? 'primary' : 'default'}
            >
              {isEditing ? 'Editing' : 'Edit'}
            </Button>
            <div className="flex gap-2">
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                Download
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendCode}
                loading={isLoading}
                disabled={(!isEditing && editableCode === message.content) || isLoading}
              >
                {isEditing ? 'Send Edited Code' : 'Forward Code'}
              </Button>
            </div>
          </div>
        }
      >
        <div style={{ height: '60vh' }}>
          <Editor
            height="100%"
            width="100%"
            theme={theme === THEME.DARK ? 'vs-dark' : 'light'}
            language={message.fileName ? getLanguageFromExtension(message.fileName) : 'javascript'}
            value={editableCode}
            onChange={(value) => isEditing && setEditableCode(value || '')}
            onMount={handleEditorDidMount}
            options={{
              readOnly: !isEditing,
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

  return (
    <div className="w-full">
      {message?.notificationMessage ? (
        <div className="flex justify-center text-[14px]">{message?.content}</div>
      ) : message?.sender?._id === user?._id ? (
        <div className="group flex items-center justify-end gap-5">
          {!message?.isRecalled && (
            <Popover className="px-3 py-1" placement="left" trigger="click" content={popoverContent}>
              <Button className="opacity-0 group-hover:opacity-100" shape="circle">
                <BsThreeDotsVertical />
              </Button>
            </Popover>
          )}

          <div className={`flex h-fit w-fit max-w-[70%] flex-col items-end gap-2 text-end`}>
            {message?.isRecalled ? (
              <span className="w-fit rounded-2xl bg-primary-color px-3 py-1 text-end text-[14px] text-white opacity-50">
                You recalled this message.
              </span>
            ) : (
              <div
                className={`flex flex-col items-end gap-3 ${!message?.hasCodeFile && 'w-fit rounded-2xl bg-primary-color text-end text-white'} ${!message?.hasFile && 'px-3 py-1'}`}
              >
                {message?.hasFile && message?.fileUrl?.length
                  ? message?.fileUrl?.map((url) => <Image className="rounded-md" src={url} />)
                  : message?.hasCodeFile
                    ? renderCodeMessage()
                    : null}
                {message?.hasText && !message?.hasCodeFile && (
                  <div className={`${message?.hasFile && 'px-3'}`}>
                    <span className="text-[14px]">{message?.content}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="flex w-fit max-w-[70%] items-end gap-3">
            <Tooltip className="cursor-pointer" title={message?.sender?.username}>
              <Avatar
                onClick={() => navigate(paths.profile.replace(':userId', message?.sender?._id || ''))}
                className="flex-none"
                src={message?.sender?.avatar}
                size={32}
              />
            </Tooltip>
            {message?.isRecalled ? (
              <div className={`left-message w-fit rounded-2xl px-3 py-1 opacity-50`}>
                <Typography.Text className="text-[14px] opacity-100">
                  {message?.sender.username} recalled this message.
                </Typography.Text>
              </div>
            ) : (
              <div className="left-message flex flex-col gap-1 rounded-2xl">
                <div className={`w-fit`}>
                  {message?.hasFile && message?.fileUrl?.length
                    ? message?.fileUrl?.map((url) => <Image className="rounded-md" src={url} />)
                    : message?.hasCodeFile
                      ? renderCodeMessage()
                      : null}
                </div>
                {message?.hasText && !message?.hasCodeFile && (
                  <div className={`left-message w-fit rounded-2xl ${message?.hasFile ? 'p-0' : 'px-3 py-1'}`}>
                    <div className={`${message?.hasFile && 'w-fit px-3'}`}>
                      <Typography.Text className="text-[14px] opacity-100">{message?.content}</Typography.Text>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {renderCodeModal()}
    </div>
  );
};

export default MessageItem;
