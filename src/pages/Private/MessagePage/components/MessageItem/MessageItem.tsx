import { Avatar, Image, Tooltip, Typography } from 'antd';
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
          <div
            className={`h-fit w-fit max-w-[70%] rounded-2xl bg-primary-color text-white ${message?.hasFile ? 'p-0' : 'px-3 py-1'} ${message?.hasFile && !message?.hasText && 'bg-transparent'}`}
          >
            <Tooltip placement="leftBottom" title={timeAgo(message.createdAt!)}>
              {message?.hasFile && message?.fileUrl && (
                <Image className="h-full flex-1 rounded-md" src={message?.fileUrl} />
              )}
              {message?.hasText && (
                <div className={`${message?.hasFile && 'px-3'}`}>
                  <Typography.Text className={`text-white opacity-100`}>{message?.content}</Typography.Text>
                </div>
              )}
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="flex w-fit max-w-[70%] gap-3">
            <Avatar className="flex-none" src={message?.sender?.avatar} size={32} />
            <div className={`left-message rounded-2xl ${message?.hasFile ? 'p-0' : 'px-3 py-1'}`}>
              <Tooltip placement="rightBottom" title={timeAgo(message.createdAt!)}>
                {message?.hasFile && message?.fileUrl && <Image className="rounded-md" src={message?.fileUrl} />}
                {message?.hasText && (
                  <div className={`${message?.hasFile && 'px-3'}`}>
                    <Typography.Text className={`opacity-100`}>{message?.content}</Typography.Text>
                  </div>
                )}
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
