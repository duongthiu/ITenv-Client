import { Image, Tooltip, Mentions } from 'antd';
import React, { useRef, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { RiImageAddLine } from 'react-icons/ri';
import InputWithEmoji from '../../../../../components/commons/InputWithEmoji/InputWithEmoji';
import { useSocket } from '../../../../../context/SocketContext';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { addMessageToMessageList } from '../../../../../redux/message/message.slice';
import { sendMessage } from '../../../../../services/message/message.service';
import { MessageType, PreviewImage } from '../../../../../types/ConversationType';
import { getBase64 } from '../../../../../utils/helpers/getBase64';
import { notifyError } from '../../../../../utils/helpers/notify';
import { ResponsePagination } from '../../../../../types/common';
import CodeModal from './CodeModal';
import './MessageFooter.style.scss';
import { VscCode } from 'react-icons/vsc';
type MessagePageFooterProps = {
  conversationId?: string;
  receiver?: string;
  members?: { _id: string; username: string; avatar?: string }[];
};

const MessagePageFooter: React.FC<MessagePageFooterProps> = ({ conversationId, receiver, members = [] }) => {
  const socket = useSocket();
  const [message, setMessage] = useState<string>('');
  const { user } = useAppSelector((state) => state.user);
  const [previewImage, setPreviewImage] = useState<PreviewImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList>();
  const dispatch = useAppDispatch();
  const codeFileInputRef = useRef<HTMLInputElement>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [codeFileName, setCodeFileName] = useState('');

  const onEmojiClick = (emojiObject: any) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const handleSendMessage = async () => {
    try {
      if (socket && (message.trim() || previewImage.length)) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('content', message.trim());
        formData.append('hasText', message.trim() ? 'true' : 'false');
        formData.append('hasFile', previewImage.length > 0 ? 'true' : 'false');
        formData.append('conversationId', conversationId || '');
        formData.append('receiver', receiver || '');
        if (files) {
          Array.from(files).forEach((file) => {
            formData.append('file', file);
          });
        }
        formData.append('isSeenBy', JSON.stringify([user?._id]));
        const messageRes: ResponsePagination<MessageType> = await sendMessage(formData);
        if (messageRes?.success) {
          console.log(messageRes);
          socket.emit('message', messageRes?.data);
          setIsLoading(false);
          setMessage('');
          setPreviewImage([]);
          // mutateConversation && mutateConversation();
          dispatch(addMessageToMessageList(messageRes!.data!));
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      notifyError((error as any).response.data.message);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imgs: PreviewImage[] = [];
      for (const file of Array.from(e.target.files)) {
        if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
          notifyError('Only image files are allowed');
          return;
        }
        const res = await getBase64(file);
        imgs.push({ name: file.name, path: res });
      }
      setPreviewImage(imgs);
      setFiles(e.target.files); // Now works without error
    }
  };

  const handleDeleteImage = (index: number) => {
    setPreviewImage((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCodeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      setCodeFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCodeContent(content);
        setIsCodeModalOpen(true);
      };
      reader.readAsText(file);
    }
  };

  const handleSendCode = async (code: string) => {
    try {
      if (socket) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('content', code);
        formData.append('hasText', 'true');
        formData.append('hasFile', 'false');
        formData.append('hasCodeFile', 'true');
        formData.append('conversationId', conversationId || '');
        formData.append('receiver', receiver || '');
        formData.append('isSeenBy', JSON.stringify([user?._id]));
        formData.append('fileName', codeFileName);
        const messageRes: ResponsePagination<MessageType> = await sendMessage(formData);
        if (messageRes?.success) {
          socket.emit('message', messageRes?.data);
          setIsLoading(false);
          setIsCodeModalOpen(false);
          dispatch(addMessageToMessageList(messageRes!.data!));
        } else {
          setIsLoading(false);
          notifyError(messageRes?.message || 'Something went wrong');
        }
      }
    } catch (error) {
      setIsLoading(false);
      notifyError((error as any).response.data.message);
    }
  };

  const handleCodeButtonClick = () => {
    codeFileInputRef.current?.click();
  };

  const mentionsStyles = {
    textarea: {
      border: 'none',
      boxShadow: 'none',
      padding: 0
    },
    '.ant-mentions-outlined:focus-within': {
      border: 'none !important',
      boxShadow: 'none'
    },
    '.ant-mentions-focused:focus-within': {
      border: 'none !important',
      boxShadow: 'none'
    }
  };

  return (
    <div className="relative flex h-[60px] items-center gap-4 px-3">
      <div className="flex items-center gap-2">
        <div className="rounded-full p-2 hover:bg-gray-100">
          <VscCode
            onClick={handleCodeButtonClick}
            className="cursor-pointer duration-200 hover:text-primary-color-hover"
            color="#21a1d3"
            size={25}
          />
          <input
            type="file"
            ref={codeFileInputRef}
            onChange={handleCodeFileChange}
            className="hidden"
            accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.rb,.php,.txt,.json,.xml,.css,.scss,.sql,.md,.yml,.yaml"
          />
        </div>
        <div className="rounded-full p-2 hover:bg-gray-100">
          <RiImageAddLine
            onClick={handleIconClick}
            className="cursor-pointer duration-200 hover:text-primary-color-hover"
            color="#21a1d3"
            size={25}
          />
          <input type="file" ref={fileInputRef} multiple onChange={handleImageChange} className="hidden" />
        </div>

        {previewImage.length > 0 && (
          <div className="card absolute bottom-[60px] flex w-[99%] gap-5 overflow-x-auto">
            {previewImage.map((img, index) => (
              <div key={index} className="relative h-[100px] w-[100px] flex-none">
                <Image
                  rootClassName="flex-none"
                  className="h-[100px] w-[100px] object-cover"
                  src={img.path}
                  alt={img.name}
                />
                <AiFillCloseCircle
                  onClick={() => handleDeleteImage(index)}
                  className="absolute right-1 top-1 cursor-pointer rounded-full bg-black text-white"
                  size={20}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* duration-200 focus:border-primary-color focus:bg-opacity-100 focus:shadow-2xl */}
      <div className="message-footer-wrapper input-mode flex flex-1 items-center rounded-full border-[1px] border-transparent py-2 pr-3">
        <Mentions
          autoSize
          value={message}
          onChange={setMessage}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type @ to mention someone..."
          options={members.map((member) => ({
            key: member._id,
            value: member.username,
            label: (
              <div className="flex items-center gap-2">
                {member.avatar && (
                  <img src={member.avatar} alt={member.username} className="h-5 w-5 rounded-full object-cover" />
                )}
                <span>{member.username}</span>
              </div>
            )
          }))}
          className="w-full rounded-full !border-none bg-transparent px-4 py-2 text-[1.4rem] outline-none"
          styles={mentionsStyles}
        />
        <InputWithEmoji onEmojiClick={onEmojiClick} />
      </div>

      {isLoading ? (
        <FaSpinner size={25} color="#21a1d3" className="text:text-primary-color animate-spin" />
      ) : (
        <Tooltip title="Send">
          <IoMdSend
            className="cursor-pointer duration-200 hover:text-primary-color-hover"
            color="#21a1d3"
            size={25}
            onClick={handleSendMessage}
          />
        </Tooltip>
      )}

      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onSend={handleSendCode}
        fileContent={codeContent}
        fileName={codeFileName}
      />
    </div>
  );
};

export default MessagePageFooter;
