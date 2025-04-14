import React from 'react';
import { Typography } from 'antd';
import { paths } from '../../../routes/paths';
import { useNavigate } from 'react-router-dom';
import chatBoxLogo from '../../../assets/logo/ai-box.jpg';

const { Text } = Typography;

interface MessageItemProps {
  message: string;
  isUser: boolean;
  avatar: string;
  userId: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isUser, avatar, userId }) => {
  const navigate = useNavigate();

  if (isUser) {
    return (
      <div className="flex items-center justify-end gap-5">
        <div className="flex h-fit w-fit max-w-[70%] flex-col items-end gap-2 text-end">
          <div className="flex w-fit flex-col items-end gap-3 rounded-2xl bg-primary-color px-3 py-1 text-end text-white">
            <div>
              <Text className="text-[14px]">{message}</Text>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-fit max-w-[70%] items-end gap-3">
      <div className="flex h-[32px] w-[32px] flex-none items-center justify-center overflow-hidden rounded-full border bg-white">
        <img
          onClick={() => navigate(paths.profile.replace(':userId', 'ai-assistant'))}
          className="h-full w-full scale-[200%] cursor-pointer border"
          src={chatBoxLogo}
        />
      </div>
      <div className="left-message flex flex-col gap-1 rounded-2xl">
        <div className="left-message w-fit rounded-2xl px-3 py-1">
          <Text className="text-[14px] opacity-100">{message}</Text>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
