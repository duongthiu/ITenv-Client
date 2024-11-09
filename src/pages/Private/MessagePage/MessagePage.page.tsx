import { UploadProps } from 'antd';
import { useState } from 'react';
import { getConversationsByUserId } from '../../../services/conversation/conversation.service';
import { QueryOptions } from '../../../types/common';
import { ConversationType } from '../../../types/ConversationType';
import { usePagination } from '../../../utils/hooks/usePagination.hook';
import MessageSidebar from './components/sidebar/MessageSidebar';
import MessagePageContent from './MessagePageContent/MessagePageContent.component';

const MessagePage = () => {
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
  const [activeConversationId, setActiveConversation] = useState<string>(
    conversationData?.data?.length ? conversationData?.data[0]._id : ''
  );

  return (
    <div className="flex h-full">
      <MessageSidebar
        activeConversationId={activeConversationId}
        setActiveConversation={setActiveConversation}
        conversations={conversationData!}
        mutate={mutateConversation}
      />
      {conversationData?.data?.find((conv) => conv._id === activeConversationId) && (
        <MessagePageContent conversation={conversationData?.data?.find((conv) => conv._id === activeConversationId)} />
      )}
    </div>
  );
};

export default MessagePage;
