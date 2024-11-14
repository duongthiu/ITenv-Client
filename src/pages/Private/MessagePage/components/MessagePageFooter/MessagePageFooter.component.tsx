import { Image, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { AiFillCloseCircle, AiOutlineFileAdd } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { RiImageAddLine } from 'react-icons/ri';
import InputWithEmoji from '../../../../../components/commons/InputWithEmoji/InputWithEmoji';
import { useSocket } from '../../../../../context/SocketContext';
import { useAppSelector } from '../../../../../redux/app/hook';
import { sendMessage } from '../../../../../services/message/message.service';
import { MessageType, PreviewImage } from '../../../../../types/ConversationType';
import { getBase64 } from '../../../../../utils/helpers/getBase64';
import { notifyError } from '../../../../../utils/helpers/notify';

type MessagePageFooterProps = {
  conversationId?: string;
  receiver?: string;
  setMessageList: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

const MessagePageFooter: React.FC<MessagePageFooterProps> = ({ conversationId, receiver, setMessageList }) => {
  const socket = useSocket();
  const [message, setMessage] = useState<string>('');
  const { user } = useAppSelector((state) => state.user);
  const [previewImage, setPreviewImage] = useState<PreviewImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList>();
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
        const messageRes = await sendMessage(formData);
        if (messageRes?.success) {
          socket.emit('message', messageRes?.data);
          setIsLoading(false);
          setMessage('');
          setPreviewImage([]);
          setMessageList((prev: any) => [
            ...prev,
            { sender: { _id: user?._id, username: user?.username, avatar: user?.avatar }, ...messageRes?.data }
          ]);
        } else {
          setIsLoading(false);
          notifyError(messageRes?.message || 'Error sending message');
        }
      }
    } catch (error) {
      notifyError('Error sending message');
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

  return (
    <div className="relative flex h-[60px] items-center gap-4 px-3">
      <div className="flex items-center gap-2">
        <AiOutlineFileAdd
          className="cursor-pointer duration-200 hover:text-primary-color-hover"
          color="#21a1d3"
          size={25}
        />

        {/* Custom Icon Button for File Input */}
        <RiImageAddLine
          onClick={handleIconClick}
          className="cursor-pointer duration-200 hover:text-primary-color-hover"
          color="#21a1d3"
          size={25}
        />
        <input type="file" ref={fileInputRef} multiple onChange={handleImageChange} className="hidden" />

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

      <div className="input-mode flex flex-1 items-center rounded-full py-2 pr-3">
        <input
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full rounded-full bg-transparent px-4 py-2 text-[1.4rem] outline-none"
          type="text"
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
    </div>
  );
};

export default MessagePageFooter;
