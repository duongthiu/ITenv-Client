import React, { useState } from 'react';
import chatBoxLogo from '../../../assets/logo/ai-box.jpg';
import robotThinking from '../../../assets/ai-chat/robot-thinking.json';
import { Popover, Typography, Input, Button } from 'antd';
import { paths } from '../../../routes/paths';
import { useNavigate } from 'react-router-dom';
import { SendOutlined } from '@ant-design/icons';
import MessageItem from './MessageItem.component';
import Lottie from 'lottie-react';
import { chatWithClaude } from '../../../services/chat/chat.service';

const { Text } = Typography;
const { TextArea } = Input;

interface ChatBoxProps {}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Claude, your AI coding assistant. How can I help you today?",
      isUser: false
    }
  ]);
  const navigate = useNavigate();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        isUser: true
      };
      setMessages((prev) => [...prev, userMessage]);
      setMessage('');
      setIsLoading(true);

      try {
        // Get Claude response
        const response = await chatWithClaude(message);
        if (response.success) {
          // Add Claude response
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response.data as any,
            isUser: false
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          throw new Error(response.message || 'Failed to get response from Claude');
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I encountered an error. Please try again.",
          isUser: false
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const chatContent = (
    <div className="flex h-[500px] w-[350px] flex-col rounded-lg bg-transparent">
      <div className="flex items-center justify-between rounded-t-lg border-b bg-transparent p-3">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full border bg-white">
              <Lottie className="scale-[200%]" animationData={robotThinking} loop={true} />
            </div>
          ) : (
            <div className="flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full border bg-white">
              <img
                onClick={() => navigate(paths.profile.replace(':userId', 'ai-assistant'))}
                className="scale-[200%] cursor-pointer border"
                src={chatBoxLogo}
              />
            </div>
          )}
          <Text className="text-[14px] font-semibold">AI Assistant</Text>
        </div>
        <Button type="text" onClick={toggleChat} className="text-[20px]">
          ×
        </Button>
      </div>
      <div className="flex flex-1 flex-col-reverse overflow-y-auto py-3">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg.content}
              isUser={msg.isUser}
              avatar={chatBoxLogo}
              userId={msg.isUser ? 'user' : 'ai-assistant'}
            />
          ))}
          {isLoading && (
            <div className="flex w-fit max-w-[70%] items-end gap-3">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full border bg-white">
                <Lottie className="scale-[200%]" animationData={robotThinking} loop={true} />
              </div>
              <div className="left-message flex flex-col gap-1 rounded-2xl">
                <div className="left-message w-fit rounded-2xl px-3 py-1">
                  <div className="flex h-8 items-center gap-1">
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 border-t border-gray-200 p-3">
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          className="flex-1"
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          className="flex items-center justify-center"
          loading={isLoading}
          disabled={isLoading}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Popover
        content={chatContent}
        trigger="click"
        open={isOpen}
        onOpenChange={setIsOpen}
        placement="topLeft"
        overlayClassName="chat-popover"
      >
        <div
          className="flex size-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary-color shadow-lg transition-transform duration-300 hover:scale-110"
          onClick={toggleChat}
        >
          <img className="aspect-square h-full w-full scale-[150%] rounded-full" src={chatBoxLogo} />
        </div>
      </Popover>
    </div>
  );
};

export default ChatBox;
