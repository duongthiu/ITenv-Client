import React, { useEffect, useMemo, useState } from 'react';
import { QueryOptions, ResponsePagination } from '../../../../../types/common';
import { usePagination } from '../../../../../utils/hooks/usePagination.hook';
import { ConversationType, MessageType } from '../../../../../types/ConversationType';
import { ComponentPopover } from '../IconPopover.component';
import MessageComponent from './Message.component';
import { PiMessengerLogo } from 'react-icons/pi';
import { cn } from '../../../../../utils/helpers/cn';
import { getConversationsByUserId } from '../../../../../services/conversation/conversation.service';
import { useSocket } from '../../../../../context/SocketContext';
import { useAppSelector } from '../../../../../redux/app/hook';

const MessagePopover = () => {
  const socket = useSocket();
  const { user } = useAppSelector((state) => state.user);
  const [messagesVisible, setMessagesVisible] = useState(false);
  const [totalSeenMessages, setTotalSeenMessages] = useState(0);
  const [queryOptionConversation, setQueryOptionConversation] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });
  const {
    data: conversationData,
    refresh: mutateConversation,
    isLoading: isLoadingConversation
  } = usePagination<ConversationType[]>(
    `conversation ${JSON.stringify(queryOptionConversation)}`,
    queryOptionConversation,
    () => getConversationsByUserId(queryOptionConversation)
  );

  // let hasNotificationListener = false;
  useEffect(() => {
    if (socket) {
      socket.on('message', (message: ResponsePagination<MessageType>) => {
        mutateConversation();
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
        // hasNotificationListener = false;
      }
    };
  }, [socket]);
  const totalNotSeen = useMemo(() => {
    return conversationData?.data?.filter((conv) => !conv.lastMessage?.isSeenBy?.includes(user?._id || '')).length;
  }, [conversationData?.data, user?._id]);
  return (
    <ComponentPopover
      content={
        <MessageComponent totalNotSeen={totalNotSeen} conversations={conversationData!} mutate={mutateConversation} />
      }
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
};

export default MessagePopover;
