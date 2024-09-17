import React from 'react';
import { MessageType } from '../../../../../types/MessageType';
import { Tooltip, Typography } from 'antd';

type MessageItemProps = {
  message: MessageType;
};

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className="my-2 w-full">
      {message.sender === 'you' ? (
        <div className="flex justify-end">
          <div className="w-fit max-w-[45%] rounded-2xl bg-primary-color px-3 py-1 text-white">
            <Tooltip title={message.sentAt.toLocaleString()}>
              <Typography.Text className="text-white opacity-100">{message.content}</Typography.Text>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="left-message w-fit max-w-[45%] rounded-2xl px-3 py-1">
            <Tooltip title={message.sentAt.toLocaleString()}>
              <Typography.Text className="opacity-100">{message.content}</Typography.Text>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
