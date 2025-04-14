import { memo, useEffect, useMemo, useState } from 'react';
import { PiMessengerLogo } from 'react-icons/pi';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { setConversations } from '../../../../../redux/message/message.slice';
import { getConversationsByUserId } from '../../../../../services/conversation/conversation.service';
import { QueryOptions } from '../../../../../types/common';
import { ConversationType } from '../../../../../types/ConversationType';
import { cn } from '../../../../../utils/helpers/cn';
import { usePagination } from '../../../../../utils/hooks/usePagination.hook';
import { ComponentPopover } from '../IconPopover.component';
import MessageComponent from './Message.component';

const MessagePopover = memo(() => {
  const { user } = useAppSelector((state) => state.user);
  const { conversations } = useAppSelector((state) => state.conversation);
  const [messagesVisible, setMessagesVisible] = useState(false);
  const dispatch = useAppDispatch();
  const [queryOptionConversation] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });
  const { data: conversationData } = usePagination<ConversationType[]>(
    `conversation ${JSON.stringify(queryOptionConversation)}`,
    queryOptionConversation,
    () => {
      if (!conversations) return getConversationsByUserId(queryOptionConversation);
    }
  );

  useEffect(() => {
    if (conversationData) dispatch(setConversations(conversationData?.data));
  }, [conversationData, dispatch]);

  const totalNotSeen = useMemo(() => {
    return conversations?.filter((conv) => !conv.lastMessage?.isSeenBy?.includes(user?._id || '')).length;
  }, [conversations, user?._id]);
  return (
    <ComponentPopover
      content={<MessageComponent totalNotSeen={totalNotSeen!} conversations={conversations!} />}
      isOpen={messagesVisible}
      setOpen={setMessagesVisible}
      total={totalNotSeen}
      icon={
        <PiMessengerLogo
          size={25}
          // color={!messagesVisible && 'text-[#4bc0f1]'}
          className={cn('duration-200 hover:text-[#64f6ee]', messagesVisible && 'text-[#4bc0f1]')}
        />
      }
      placement="bottomRight"
    />
  );
});

export default MessagePopover;
