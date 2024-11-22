import { Badge, Input, List, Typography, Empty } from 'antd';
import MessageItem from './MessageItem.component';
import { IoSearchOutline } from 'react-icons/io5';
import { paths } from '../../../../../routes/paths';
import { Link } from 'react-router-dom';
import { ResponsePagination } from '../../../../../types/common';
import { ConversationType } from '../../../../../types/ConversationType';

type ConversationProps = {
  conversations: ResponsePagination<ConversationType[]>;
  mutate: () => Promise<void>;
  totalNotSeen: number;
};

const MessageComponent: React.FC<ConversationProps> = ({ conversations, mutate, totalNotSeen }) => {
  return (
    <div className="w-[350px]" style={{ maxHeight: '500px', overflow: 'auto' }}>
      <List
        header={
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="mb-5 flex gap-2 text-[1.6rem] font-semibold">
                <Typography.Title level={3} className="text-[1.6rem]">
                  Messages
                </Typography.Title>
                <Badge count={totalNotSeen} />
              </div>
            </div>
            <Input placeholder="Search your friends..." prefix={<IoSearchOutline />} />
          </div>
        }
        footer={
          <div className="flex justify-center">
            <Link to={paths.messages.replace(':id', '')} className="text-center">
              Read all messages
            </Link>
          </div>
        }
        dataSource={conversations?.data || []}
        renderItem={(conversation) => <MessageItem key={conversation?._id} conversation={conversation} />}
        locale={{ emptyText: <Empty description="No messages found" /> }}
      />
    </div>
  );
};

export default MessageComponent;
