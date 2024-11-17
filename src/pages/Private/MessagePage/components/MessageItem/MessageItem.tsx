import { Avatar, Button, Image, Popover, Typography } from 'antd';
import React, { useState } from 'react';
import { useAppSelector } from '../../../../../redux/app/hook';
import { MessageType } from '../../../../../types/ConversationType';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { recallMessage } from '../../../../../services/message/message.service';

type MessageItemProps = {
  message: MessageType;
  handleRecallMessageSocket: (message: MessageType) => void;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, handleRecallMessageSocket }) => {
  const [messageState, setMessageState] = useState(message);
  const handleRecall = async () => {
    try {
      const response = await recallMessage(message?._id || '');
      if (response.success) {
        setMessageState({ ...message, isRecalled: true });
        handleRecallMessageSocket({ ...message, isRecalled: true });
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
        onClick={() => console.log('Edit clicked')}
      >
        Edit
      </Button>
      <Button
        className="flex w-full justify-start text-start hover:bg-primary-color hover:text-white"
        type="text"
        onClick={handleRecall}
      >
        Recall
      </Button>

      {/* <Button
        className="flex w-full justify-start text-start hover:bg-primary-color hover:text-white"
        type="text"
        onClick={() => console.log('Delete clicked')}
      >
        Delete
      </Button> */}
    </div>
  );
  const { user: userSelector } = useAppSelector((state) => state.user);
  return (
    <div className="w-full">
      {message?.sender?._id === userSelector?._id ? (
        <div className="group flex items-center justify-end gap-5">
          {!messageState?.isRecalled && (
            <Popover className="px-3 py-1" placement="left" trigger="click" content={popoverContent}>
              <Button className="opacity-0 group-hover:opacity-100" shape="circle">
                <BsThreeDotsVertical />
              </Button>
            </Popover>
          )}

          <div className={`flex h-fit w-fit max-w-[70%] flex-col items-end gap-2 text-end`}>
            {messageState?.isRecalled ? (
              <Typography.Text className="w-fit rounded-2xl bg-primary-color px-3 py-1 text-end text-[1.4rem] text-white opacity-50">
                You recalled this messageState.
              </Typography.Text>
            ) : (
              <div className="flex flex-col items-end gap-3">
                {messageState?.hasFile && messageState?.fileUrl?.length
                  ? messageState?.fileUrl?.map((url) => <Image className="rounded-md" src={url} />)
                  : messageState?.file?.length
                    ? messageState?.file?.map((file) => <Image className="rounded-md" src={file.path} />)
                    : null}
                <div
                  className={`w-fit rounded-2xl bg-primary-color text-end text-white ${messageState?.hasFile ? 'p-0' : 'px-3 py-1'} ${messageState?.hasFile && !messageState?.hasText && 'bg-transparent text-end'}`}
                >
                  {messageState?.hasText && (
                    <div className={`${messageState?.hasFile && 'px-3'}`}>
                      <Typography.Text className={`text-white opacity-100`}>{messageState?.content}</Typography.Text>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="flex w-fit max-w-[70%] items-end gap-3">
            <Avatar className="flex-none" src={message?.sender?.avatar} size={32} />
            {message?.isRecalled ? (
              <div className={`left-message w-fit rounded-2xl px-3 py-1 opacity-50`}>
                <Typography.Text className={`opacity-100`}>
                  {message?.sender.username} recalled this message.
                </Typography.Text>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
