import { Avatar, Image, Typography } from 'antd';
import React from 'react';
import { useAppSelector } from '../../../../../redux/app/hook';
import { MessageType } from '../../../../../types/ConversationType';

type MessageItemProps = {
  message: MessageType;
};

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { user: userSelector } = useAppSelector((state) => state.user);
  return (
    <div className="w-full">
      {message?.sender?._id === userSelector?._id ? (
        <div className="flex justify-end">
          <div className={`flex h-fit w-fit max-w-[70%] flex-col items-end gap-2 text-end`}>
            {message?.hasFile && message?.fileUrl?.length
              ? message?.fileUrl?.map((url) => <Image className="rounded-md" src={url} />)
              : message?.file?.length
                ? message?.file?.map((file) => <Image className="rounded-md" src={file.path} />)
                : null}
            <div
              className={`w-fit rounded-2xl bg-primary-color text-end text-white ${message?.hasFile ? 'p-0' : 'px-3 py-1'} ${message?.hasFile && !message?.hasText && 'bg-transparent text-end'}`}
            >
              {message?.hasText && (
                <div className={`${message?.hasFile && 'px-3'}`}>
                  <Typography.Text className={`text-white opacity-100`}>{message?.content}</Typography.Text>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="flex w-fit max-w-[70%] items-end gap-3">
            <Avatar className="flex-none" src={message?.sender?.avatar} size={32} />
            <div className="flex flex-col gap-1">
              <div className={`w-fit`}>
                {message?.hasFile && message?.fileUrl?.length
                  ? message?.fileUrl?.map((url) => <Image className="rounded-md" src={url} />)
                  : null}
              </div>
              <div className={`left-message w-fit rounded-2xl ${message?.hasFile ? 'p-0' : 'px-3 py-1'}`}>
                {/* <Tooltip placement="rightBottom" title={timeAgo(message.createdAt!)}> */}

                {message?.hasText && (
                  <div className={`${message?.hasFile && 'w-fit px-3'}`}>
                    <Typography.Text className={`opacity-100`}>{message?.content}</Typography.Text>
                  </div>
                )}
                {/* </Tooltip> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
