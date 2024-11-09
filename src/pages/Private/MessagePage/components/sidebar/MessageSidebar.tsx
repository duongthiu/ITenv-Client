import { Divider, List, Typography } from 'antd';
import { memo, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import messageLogo from '../../../../../assets/logo/messenger-icon.png';
import MessageItem from '../../../../../components/commons/header/components/Message/MessageItem.component';
import { cn } from '../../../../../utils/helpers/cn';
import { ConversationType } from '../../../../../types/ConversationType';
import { ResponsePagination } from '../../../../../types/common';
type MessageSidebarProps = {
  conversations: ResponsePagination<ConversationType[]>;
  mutate: () => Promise<void>;
  activeConversationId?: string;
  setActiveConversation?: React.Dispatch<React.SetStateAction<string>> | undefined;
};
const MessageSidebar: React.FC<MessageSidebarProps> = memo(
  ({ conversations, mutate, activeConversationId, setActiveConversation }) => {
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const toggleCollapsed = () => {
      setCollapsed(!collapsed);
    };
    return (
      <div
        className={cn(
          'sidebar-wrapper card ml-5 mt-5 flex flex-col rounded-2xl border p-2 shadow-xl duration-200',
          !collapsed ? 'w-[350px]' : 'collapsed w-[80px]'
        )}
      >
        <div className="mt-2 h-[50px]">
          {!collapsed ? (
            <Typography.Title level={4} className="m-0 rounded-2xl p-3">
              Messages
            </Typography.Title>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <img className="h-[36px] w-[36px] object-cover" src={messageLogo} />
            </div>
          )}
        </div>

        <Divider className="my-[12px]" />
        <div className="h-full w-full overflow-auto">
          <List
            dataSource={conversations?.data || []}
            renderItem={(conversation) => (
              <MessageItem
                activeConversationId={activeConversationId}
                setActiveConversation={setActiveConversation}
                key={conversation?._id}
                conversation={conversation}
              />
            )}
          />
        </div>
        <div
          onClick={toggleCollapsed}
          className="flex h-[40px] min-h-[40px] w-full cursor-pointer items-center justify-center border-t border-border-color px-8"
        >
          <div className={`${collapsed && 'hidden'} `}>
            <IoIosArrowBack size={25} />
          </div>
          <div className={`${!collapsed && 'hidden'}`}>
            <IoIosArrowForward size={25} />
          </div>
        </div>
      </div>
    );
  }
);

export default MessageSidebar;
