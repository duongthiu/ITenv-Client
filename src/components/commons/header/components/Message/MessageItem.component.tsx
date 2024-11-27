import { Avatar, Typography } from 'antd';
import React, { memo } from 'react';
import { GoDotFill } from 'react-icons/go';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { useAppSelector } from '../../../../../redux/app/hook';
import { ConversationType } from '../../../../../types/ConversationType';
import { cn } from '../../../../../utils/helpers/cn';
import timeAgo from '../../../../../utils/helpers/timeAgo';
import './MessageItem.style.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from '../../../../../routes/paths';
type MessageItemProps = {
  conversation: ConversationType;
};

const MessageItem: React.FC<MessageItemProps> = memo(({ conversation }) => {
  const { activeConversationId } = useAppSelector((state) => state.conversation);
  const location = useLocation();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const isSeenMessage = conversation?.lastMessage?.isSeenBy.find((seenBy) => seenBy === user?._id);
  return (
    <div
      className={`link-hover group container relative mb-2 flex cursor-pointer items-center gap-5 rounded-lg p-[12px] duration-200 ${location.pathname.includes('messages') && activeConversationId === conversation?._id && 'active-link'}`}
      onClick={() => {
        navigate(paths.messages.replace(':id', conversation._id!));
        // if (conversation && setActiveConversation) setActiveConversation(conversation._id!);
      }}
    >
      <div className="relative flex-none">
        <Avatar
          size={42}
          icon={conversation?.isGroupChat && <HiOutlineUserGroup />}
          src={
            !conversation?.isGroupChat &&
            conversation?.participants?.find((member) => member?._id !== user?._id)?.avatar
          }
        />
        {conversation?.participants?.find((member) => member?._id !== user?._id)?.status && (
          <div className={`absolute -bottom-1 right-0 flex items-center text-green-500`}>
            <div className="h-4 w-4 rounded-full border-[1px] border-white bg-green-500"></div>
          </div>
        )}
      </div>
      <div className="content flex flex-auto items-center justify-between truncate">
        <div className={`flex flex-col ${isSeenMessage && 'opacity-80'} `}>
          <Typography.Text strong={!isSeenMessage} className="text-[1.4rem]">
            {conversation?.isGroupChat
              ? conversation?.groupName
              : conversation?.participants?.find((member) => member?._id !== user?._id)?.username}
          </Typography.Text>
          <div className="flex flex-auto gap-3">
            {conversation?.lastMessage?.isRecalled ? (
              <Typography.Text strong={!isSeenMessage} className="text-[1.2rem]">
                This message has been recalled
              </Typography.Text>
            ) : (
              <Typography.Text strong={!isSeenMessage} className="text-[1.2rem]">
                {conversation?.lastMessage?.sender?._id === user?._id && 'You: '}{' '}
                {conversation?.lastMessage?.hasText
                  ? conversation?.lastMessage?.content?.substring(0, 50)
                  : conversation?.lastMessage?.hasFile
                    ? 'sent a image'
                    : conversation?.isGroupChat &&
                      `${conversation?.createdBy?.username?.slice(0, 10)} created this GroupChat`}
              </Typography.Text>
            )}

            <Typography.Text strong={!isSeenMessage} className="flex-none text-[1.2rem] text-gray-400">
              {timeAgo(conversation?.lastMessage?.createdAt || conversation?.createdAt || '')}
            </Typography.Text>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* <Popover
            placement="bottomRight"
            content={<>hehe</>}
            trigger="click"
            arrow={false}
            className="popover-notification cursor-pointer"
            overlayClassName="max-w-[45rem] max-h-[40rem] p-0"
            autoAdjustOverflow={false}
          >
            <HiDotsHorizontal
              size={22}
              className="hidden text-gray-500 duration-200 hover:text-gray-800 group-hover:block"
            />
          </Popover> */}
          <GoDotFill
            size={18}
            className={cn('absolute right-0 text-primary-color', !isSeenMessage ? 'opacity-100' : 'opacity-0')}
          />
        </div>
      </div>
    </div>
  );
});

export default MessageItem;
