import React, { ComponentPropsWithoutRef } from 'react';
import { Avatar, Typography } from 'antd';
import { paths } from '../../../routes/paths';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const { Text } = Typography;

interface MessageItemProps {
  message: string;
  isUser: boolean;
  avatar: string;
  userId: string;
  isStreaming?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isUser, avatar, userId, isStreaming }) => {
  const navigate = useNavigate();

  return (
    <div className={`flex w-full items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar
          src={avatar}
          size={32}
          className="cursor-pointer"
          onClick={() => navigate(paths.profile.replace(':userId', userId))}
        />
      )}
      <div className={`flex max-w-[70%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`${
            isUser ? 'right-message' : 'left-message'
          } w-fit rounded-2xl px-3 py-1 ${isStreaming ? 'typing' : ''}`}
        >
          <ReactMarkdown
            components={{
              p: (props: ComponentPropsWithoutRef<'p'>) => (
                <Text className="whitespace-pre-wrap">{props.children}</Text>
              ),
              code: (props: ComponentPropsWithoutRef<'code'>) => (
                <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">{props.children}</code>
              ),
              pre: (props: ComponentPropsWithoutRef<'pre'>) => (
                <pre className="rounded bg-gray-100 p-2 font-mono text-sm">{props.children}</pre>
              )
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
      </div>
      {isUser && (
        <Avatar
          src={avatar}
          size={32}
          className="cursor-pointer"
          onClick={() => navigate(paths.profile.replace(':userId', userId))}
        />
      )}
    </div>
  );
};

export default MessageItem;
