import { Empty } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../../context/SocketContext';
import { paths } from '../../../routes/paths';
import { getConversationsByUserId } from '../../../services/conversation/conversation.service';
import { QueryOptions } from '../../../types/common';
import { ConversationType } from '../../../types/ConversationType';
import { usePagination } from '../../../utils/hooks/usePagination.hook';
import MessageSidebar from './components/sidebar/MessageSidebar';
import MessagePageContent from './MessagePageContent/MessagePageContent.component';

const MessagePage = () => {
  const socket = useSocket();
  const [queryOptionConversation, setQueryOptionConversation] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: conversationData,
    refresh: mutateConversation
    // isLoading: isLoadingConversation
  } = usePagination<ConversationType[]>(
    `conversation ${JSON.stringify(queryOptionConversation)}`,
    queryOptionConversation,
    () => getConversationsByUserId(queryOptionConversation)
  );
  const [activeConversationId, setActiveConversation] = useState<string>('');

  useEffect(() => {
    if (id) {
      setActiveConversation(id);
    } else if (conversationData?.data?.length) {
      navigate(paths.messages.replace(':id', conversationData.data[0]._id!));

      // setActiveConversation(conversationData.data[0]._id);
    }
  }, [id, conversationData]);

  useEffect(() => {
    if (activeConversationId && socket) {
      console.log('set seen messageee', activeConversationId);
      socket.emit(
        'seen_message',
        conversationData?.data?.find((conv) => conv._id === activeConversationId)?.lastMessage
      );
    }
  }, [activeConversationId, conversationData?.data, socket]);
  return (
    <div className="flex h-full">
      <MessageSidebar
        activeConversationId={activeConversationId}
        setActiveConversation={setActiveConversation}
        conversations={conversationData!}
        mutate={mutateConversation}
      />
      {conversationData?.data?.find((conv) => conv._id === activeConversationId) ? (
        <MessagePageContent
          activeConversationId={activeConversationId}
          mutateConversation={mutateConversation}
          conversation={conversationData?.data?.find((conv) => conv._id === activeConversationId)}
        />
      ) : (
        <div className="card m-5 mb-0 flex flex-1 flex-col rounded-2xl pb-2 shadow-xl duration-200">
          <div className="h-full w-full items-center justify-center">
            <Empty className="flex h-full flex-col items-center justify-center" description="No messages found" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
