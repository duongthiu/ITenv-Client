import { UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, Tooltip, Typography, UploadProps } from 'antd';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdDocument, IoMdSend } from 'react-icons/io';
import { RiImageFill } from 'react-icons/ri';
import InputWithEmoji from '../../../components/commons/InputWithEmoji/InputWithEmoji';
import { MessageType } from '../../../types/MessageType';
import MessageItem from './components/MessageItem/MessageItem';
import MessageSidebar from './components/sidebar/MessageSidebar';

const MessageList: MessageType[] = [
  {
    sender: 'you',
    content: 'hello',
    sentAt: new Date('2024-08-08T10:00:00')
  },
  {
    sender: 'Thieu',
    content: 'hi',
    sentAt: new Date('2024-08-08T10:01:00')
  },
  {
    sender: 'Thieu',
    content: 'How are you?',
    sentAt: new Date('2024-08-08T10:02:00')
  },
  {
    sender: 'you',
    content: 'I am good, thank you. How about you?',
    sentAt: new Date('2024-08-08T10:03:00')
  },
  {
    sender: 'Thieu',
    content: 'I am doing well, thanks!',
    sentAt: new Date('2024-08-08T10:04:00')
  },
  {
    sender: 'you',
    content: 'What have you been up to lately?',
    sentAt: new Date('2024-08-08T10:05:00')
  },
  {
    sender: 'Thieu',
    content: 'Just working on some projects. How about you?',
    sentAt: new Date('2024-08-08T10:06:00')
  },
  {
    sender: 'you',
    content: 'Same here, busy with work.',
    sentAt: new Date('2024-08-08T10:07:00')
  },
  {
    sender: 'Thieu',
    content: 'Do you have any plans for the weekend?',
    sentAt: new Date('2024-08-08T10:08:00')
  },
  {
    sender: 'you',
    content: 'Not yet. Do you have any suggestions?',
    sentAt: new Date('2024-08-08T10:09:00')
  },
  {
    sender: 'Thieu',
    content: 'How about hiking?',
    sentAt: new Date('2024-08-08T10:10:00')
  },
  {
    sender: 'you',
    content: 'That sounds like a great idea!',
    sentAt: new Date('2024-08-08T10:11:00')
  },
  {
    sender: 'Thieu',
    content: 'Awesome! Let’s plan for it then.',
    sentAt: new Date('2024-08-08T10:12:00')
  },
  {
    sender: 'you',
    content: 'Sure, I will check some trails.',
    sentAt: new Date('2024-08-08T10:13:00')
  },
  {
    sender: 'you',
    content: 'Sure, I will check some trails.',
    sentAt: new Date('2024-08-08T10:13:00')
  },
  {
    sender: 'Thieu',
    content:
      'Perfect, looking forward to it! Sure, I will check some trails Sure, I will check some trails Sure, I will check some trails Sure, I will check some trails Sure, I will check some trails',
    sentAt: new Date('2024-08-08T10:14:00')
  },
  {
    sender: 'you',
    content:
      'Perfect, looking forward to it! Sure, I will check some trails Sure, I will check some trails Sure, I will check some trails Sure, I will check some trails Sure, I will check some trails',
    sentAt: new Date('2024-08-08T10:15:00')
  },
  {
    sender: 'Thieu',
    content: 'I will catch up with you later then.',
    sentAt: new Date('2024-08-08T10:16:00')
  },
  {
    sender: 'you',
    content: 'Alright, talk to you later.',
    sentAt: new Date('2024-08-08T10:17:00')
  },
  {
    sender: 'Thieu',
    content: 'Bye!',
    sentAt: new Date('2024-08-08T10:18:00')
  },
  {
    sender: 'you',
    content: 'Bye!',
    sentAt: new Date('2024-08-08T10:19:00')
  }
];
const MessagePage = () => {
  const [messageList, setMessageList] = useState(MessageList);
  const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text'
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      // if (info.file.status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully`);
      // } else if (info.file.status === 'error') {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    }
  };
  const [message, setMessage] = useState<string>('');
  const onEmojiClick = (emojiObject: any) => {
    console.log(emojiObject);
    setMessage((prev) => prev + emojiObject.emoji);
  };
  const handleSendMessage = () => {
    setMessageList([...messageList, { sender: 'you', content: message, sentAt: new Date() }]);
    setMessage('');
  };
  return (
    <div className="flex h-full">
      <MessageSidebar />
      <div className="card m-5 mb-0 flex flex-1 flex-col rounded-2xl shadow-xl duration-200">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-5">
            <Avatar size={42} icon={<UserOutlined />} />
            <div className="content flex flex-2 items-center justify-between">
              <div className="flex flex-col justify-center">
                <Typography.Text strong>tranduongthieu</Typography.Text>
                <div className="flex gap-3">
                  <Typography.Text className="tracking-tight" disabled>
                    online 1 hour ago
                  </Typography.Text>
                </div>
              </div>
            </div>
          </div>
          <div>
            <BsThreeDotsVertical size={22} />
          </div>
        </div>
        <Divider className="my-[8px]" />
        <div className="flex h-full flex-col-reverse gap-3 overflow-y-auto p-5">
          <div className="mt-auto">
            {messageList.map((message) => (
              <MessageItem message={message} />
            ))}
          </div>
        </div>
        <div className="flex h-[60px] items-center gap-4 px-3">
          <div className="flex items-center gap-2">
            <IoMdDocument
              className="cursor-pointer duration-200 hover:text-primary-color-hover"
              color="#21a1d3"
              size={25}
            />

            <RiImageFill
              className="cursor-pointer duration-200 hover:text-primary-color-hover"
              color="#21a1d3"
              size={25}
            />
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
      </div>
    </div>
  );
};

export default MessagePage;
