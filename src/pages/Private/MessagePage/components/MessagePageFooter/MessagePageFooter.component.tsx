import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { IoMdDocument, IoMdSend } from 'react-icons/io';
import { RiImageFill } from 'react-icons/ri';
import InputWithEmoji from '../../../../../components/commons/InputWithEmoji/InputWithEmoji';
import { useSocket } from '../../../../../context/SocketContext';
import { MessageType } from '../../../../../types/ConversationType';
import { notifyError } from '../../../../../utils/helpers/notify';
import { useAppSelector } from '../../../../../redux/app/hook';

type MessagePageFooterProps = {
  conversationId?: string;
  receiver?: string;
  setMessageList: React.Dispatch<React.SetStateAction<MessageType[]>>;
};
const MessagePageFooter: React.FC<MessagePageFooterProps> = ({ conversationId, receiver, setMessageList }) => {
  const socket = useSocket();
  const [message, setMessage] = useState<string>('');
  const { user } = useAppSelector((state) => state.user);
  const onEmojiClick = (emojiObject: any) => {
    console.log(emojiObject);
    setMessage((prev) => prev + emojiObject.emoji);
  };
  const handleSendMessage = async () => {
    try {
      if (socket) {
        if (message.trim()) {
          // Create the message data as a plain object
          const messageData = {
            content: message.trim(),
            hasText: true,
            hasFile: false,
            conversationId: conversationId || null,
            receiver: receiver || null
          };

          // Emit message data to the server
          socket.emit('message', messageData);
          if (messageData) {
            setMessage('');
            setMessageList((prev: any) => [
              ...prev,
              { sender: { _id: user?._id, username: user?.username, avatar: user?.avatar }, ...messageData }
            ]);
          }
        }
      }

      // Call API (optional)
      // const response = await sendMessage(formData);
      // if (response.success) setMessage('');
      // else notifyError('Error sending message');
    } catch (error) {
      notifyError('Error sending message');
    }
  };

  return (
    <div className="flex h-[60px] items-center gap-4 px-3">
      <div className="flex items-center gap-2">
        <IoMdDocument
          className="cursor-pointer duration-200 hover:text-primary-color-hover"
          color="#21a1d3"
          size={25}
        />

        <RiImageFill className="cursor-pointer duration-200 hover:text-primary-color-hover" color="#21a1d3" size={25} />
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
      <Tooltip title="Send">
        <IoMdSend
          className="cursor-pointer duration-200 hover:text-primary-color-hover"
          color="#21a1d3"
          size={25}
          onClick={() => handleSendMessage()}
        />
      </Tooltip>
    </div>
  );
};

export default MessagePageFooter;
