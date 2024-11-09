import { Avatar, Tooltip, Typography } from 'antd';
import React from 'react';
import { useAppSelector } from '../../../../../redux/app/hook';
import { MessageType } from '../../../../../types/ConversationType';
import { formatDate } from '../../../../../utils/helpers/formatDate';
import timeAgo from '../../../../../utils/helpers/timeAgo';

type MessageItemProps = {
  message: MessageType;
};

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { user: userSelector } = useAppSelector((state) => state.user);
  return (
    <div className="my-2 w-full">
      {message?.sender?._id === userSelector?._id ? (
        <div className="flex justify-end">
          <div className="w-fit max-w-[45%] rounded-2xl bg-primary-color px-3 py-1 text-white">
            <Tooltip title={timeAgo(message.createdAt!)}>
              <Typography.Text className="text-white opacity-100">{message?.content}</Typography.Text>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="flex w-fit max-w-[45%] gap-3">
            <Avatar src={message?.sender?.avatar} size={32} />
            <div className="left-message rounded-2xl px-3 py-1">
              <Tooltip title={timeAgo(message.createdAt!)}>
                <Typography.Text className="opacity-100">{message?.content}</Typography.Text>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
