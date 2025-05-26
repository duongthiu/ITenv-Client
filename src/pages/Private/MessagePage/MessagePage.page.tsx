import { Empty } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../../context/SocketContext';
import { useAppDispatch, useAppSelector } from '../../../redux/app/hook';
import { setAtiveConversationId, setConversations, setSeenConversation } from '../../../redux/message/message.slice';
import { paths } from '../../../routes/paths';
import { getConversationsByUserId } from '../../../services/conversation/conversation.service';
import { QueryOptions } from '../../../types/common';
import { ConversationType } from '../../../types/ConversationType';
import { usePagination } from '../../../utils/hooks/usePagination.hook';
import MessageSidebar from './components/sidebar/MessageSidebar';
import MessagePageContent from './MessagePageContent/MessagePageContent.component';
import MessageInformation from './components/MessageInformation/MessageInformation.component';

const MessagePage = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { isOpenConversationInfo } = useAppSelector((state) => state.conversation);
  const [queryOptionConversation] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeConversationId, conversations } = useAppSelector((state) => state.conversation);

  const {
    data: conversationData
    // isLoading: isLoadingConversation
  } = usePagination<ConversationType[]>(
    `conversation ${JSON.stringify(queryOptionConversation)}`,
    queryOptionConversation,
    () => getConversationsByUserId(queryOptionConversation)
  );

  useEffect(() => {
    if (id) {
      dispatch(setAtiveConversationId(id));
    } else if (conversationData?.data?.length) {
      navigate(paths.messages.replace(':id', conversationData.data[0]._id!));
    }
  }, [id, conversationData, navigate, dispatch]);
  useEffect(() => {
    if (conversationData) {
      dispatch(setConversations(conversationData?.data));
    }
  }, [conversationData, dispatch]);

  useEffect(() => {
    if (activeConversationId && socket) {
      socket.emit(
        'seen_message',
        conversationData?.data?.find((conv) => conv?._id === activeConversationId)?.lastMessage
      );
      dispatch(setSeenConversation({ conversationId: activeConversationId!, userId: user?._id || '' }));
    }
  }, [activeConversationId, conversationData?.data, dispatch, socket, user]);
  useEffect(() => {
    setAtiveConversationId(id);
  }, [id]);
  const activeConversation = useMemo(() => conversations?.find((conv) => conv?._id === id), [conversations, id]);

  return (
    <div className="flex h-full">
      <MessageSidebar />
      {activeConversation ? (
        <MessagePageContent activeConversationId={activeConversationId || ''} conversation={activeConversation} />
      ) : (
        <div className="card m-5 mb-0 flex flex-1 flex-col rounded-2xl pb-2 shadow-xl duration-200">
          <div className="h-full w-full items-center justify-center">
            <Empty className="flex h-full flex-col items-center justify-center" description="No messages found" />
          </div>
        </div>
      )}
      {activeConversation && (
        <div className={`${isOpenConversationInfo ? 'mr-5 w-[350px]' : 'w-0'} mt-5 duration-200`}>
          <MessageInformation conversation={activeConversation!} />
        </div>
      )}
    </div>
  );
};

export default MessagePage;
