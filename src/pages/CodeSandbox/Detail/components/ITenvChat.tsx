import React, { useState } from 'react';
import { Input, Button, Space, List, Avatar, Typography } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ITenvChatProps {
  sandboxId: string;
}

const ITenvChat: React.FC<ITenvChatProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // TODO: Implement chat API call
      // const response = await sendChatMessage(sandboxId, inputMessage);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'This is a placeholder response. Chat functionality will be implemented soon.',
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-4">
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item className="mb-4">
              <Space align="start">
                <Avatar
                  icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                  className={message.sender === 'user' ? 'bg-blue-500' : 'bg-green-500'}
                />
                <div className="flex flex-col">
                  <Text strong>{message.sender === 'user' ? 'You' : 'ITenv Assistant'}</Text>
                  <Text>{message.content}</Text>
                  <Text type="secondary" className="text-xs">
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </div>
              </Space>
            </List.Item>
          )}
        />
      </div>
      <div className="border-t p-4">
        <Space.Compact className="w-full">
          <TextArea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} loading={isLoading} />
        </Space.Compact>
      </div>
    </div>
  );
};

export default ITenvChat;
