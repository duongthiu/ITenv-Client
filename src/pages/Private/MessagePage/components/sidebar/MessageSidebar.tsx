import { Button, Divider, Empty, List, Tooltip, Typography } from 'antd';
import { memo, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import messageLogo from '../../../../../assets/logo/messenger-icon.png';
import MessageItem from '../../../../../components/commons/header/components/Message/MessageItem.component';
import { useAppSelector } from '../../../../../redux/app/hook';
import { cn } from '../../../../../utils/helpers/cn';
import NewMessageModal from './NewMessageModal';
const MessageSidebar: React.FC = memo(() => {
  const { conversations } = useAppSelector((state) => state.conversation);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const noConversations = !conversations || conversations.length === 0;
  return (
    <div
      className={cn(
        'sidebar-wrapper card ml-5 mt-5 flex flex-col rounded-2xl border p-2 shadow-xl duration-200',
        !collapsed ? 'w-[350px]' : 'collapsed w-[80px]'
      )}
    >
      <div className="mt-2 h-[50px]">
        {!collapsed ? (
          <div className="flex justify-between pr-2">
            <Typography.Title level={4} className="m-0 rounded-2xl p-3">
              Messages
            </Typography.Title>
            <Button shape="circle" type="default" size="large" onClick={handleModalOpen}>
              <FaRegEdit size={20} />
            </Button>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <img className="h-[36px] w-[36px] object-cover" src={messageLogo} />
          </div>
        )}
      </div>

      <Divider className="my-[12px]" />
      <div className="h-full w-full overflow-auto">
        {/* Show the list or a default empty state message */}
        {noConversations ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-500">
            <Tooltip title="Create a new conversation">
              <Empty
                description={
                  <Typography.Text>
                    <Button shape="circle" type="primary" className="text-white" onClick={handleModalOpen}>
                      <BsPlus size={25} />
                    </Button>
                  </Typography.Text>
                }
              />
            </Tooltip>
          </div>
        ) : (
          <List
            dataSource={conversations || []}
            renderItem={(conversation) => <MessageItem key={conversation?._id} conversation={conversation} />}
          />
        )}
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
      <NewMessageModal isModalOpen={isModalOpen} handleClose={handleModalClose} />
    </div>
  );
});

export default MessageSidebar;
