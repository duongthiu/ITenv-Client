import { Badge, Empty, Input, List, Typography } from 'antd';
import { IoSearchOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { paths } from '../../../../../routes/paths';
import { ConversationType } from '../../../../../types/ConversationType';
import MessageItem from './MessageItem.component';

type ConversationProps = {
  conversations: ConversationType[];
  totalNotSeen: number;
};

const MessageComponent: React.FC<ConversationProps> = ({ conversations, totalNotSeen }) => {
  return (
    <div className="flex h-[500px] w-[350px] flex-col">
      <div className="flex-none p-4">
        <div className="flex items-center justify-between">
          <div className="mb-5 flex gap-2 text-base font-semibold">
            <Typography.Title level={3} className="text-base">
              Messages
            </Typography.Title>
            <Badge count={totalNotSeen} />
          </div>
        </div>
        <Input placeholder="Search your friends..." prefix={<IoSearchOutline />} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <List
          dataSource={conversations || []}
          renderItem={(conversation) => <MessageItem key={conversation?._id} conversation={conversation} />}
          locale={{ emptyText: <Empty description="No messages found" /> }}
        />
      </div>

      <div className="flex-none border-t p-4">
        <Link to={paths.messages.replace(':id', '')} className="block text-center">
          Read all messages
        </Link>
      </div>
    </div>
  );
};

export default MessageComponent;
