import { Avatar, Divider, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import useSWR from 'swr';
import { useSocket } from '../../../../context/SocketContext';
import { useAppSelector } from '../../../../redux/app/hook';
import { getMessageByConversationId } from '../../../../services/message/message.service';
import { QueryOptions, ResponsePagination } from '../../../../types/common';
import { ConversationType, MessageType } from '../../../../types/ConversationType';
import MessageItem from '../components/MessageItem/MessageItem';
import MessagePageFooter from '../components/MessagePageFooter/MessagePageFooter.component';
import { notifyInfo } from '../../../../utils/helpers/notify';
type MessagePageContentProps = {
  conversation?: ConversationType;
  receiverId?: string;
  mutateConversation: () => Promise<void>;
  activeConversationId: string;
};
const MessagePageContent: React.FC<MessagePageContentProps> = ({
  conversation,
  receiverId,
  mutateConversation,
  activeConversationId
}) => {
  const { user } = useAppSelector((state) => state.user);
  const socket = useSocket();
  // const [conversationState, setConverSationState] = useState<ConversationType>(
  //   conversation || {
  //     isGroupChat: false,
  //     _id: '',
  //     lastMessage: null,
  //     createdAt: new Date()
  //   }
  // );
  const [queryOptionMessage, setQueryOptionMessage] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });
  // const {
  //   data: messageData,
  //   refresh: mutateMessage,
  //   isLoading: isLoadingMessage
  // } = usePagination<MessageType[]>(
  //   `messages/${conversation?._id}/${JSON.stringify(queryOptionMessage)}`,
  //   queryOptionMessage,
  //   () => getMessageByConversationId(conversation?._id || '', queryOptionMessage)
  //   );
  const {
    data: messageData,
    mutate: mutateMessage,
    isLoading: isLoadingMessage
  } = useSWR(`messages/${conversation?._id}/${JSON.stringify(queryOptionMessage)}`, () =>
    getMessageByConversationId(conversation?._id || '', queryOptionMessage)
  );

  const [messageList, setMessageList] = useState<MessageType[]>(messageData?.data || []);

  // const chatWith = conversation?.isGroupChat
  //   ? 'group'
  //   : conversation?.participants?.find((member) => member._id !== user?._id)?._id;
  // // const { data: userData, isLoading: isLoadingUser } = useSWR(
  // //   chatWith && chatWith !== 'group' ? `profile_${chatWith}` : null,
  // //   () => (chatWith ? getUserById(chatWith) : null)
  // // );

  const handleShowMember = () => {};

  useEffect(() => {
    if (messageData?.data) {
      setMessageList(messageData?.data);
    }
  }, [messageData?.data]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message: ResponsePagination<MessageType>) => {
        console.log('message received', message?.data);
        if (message && message.data) {
          setMessageList((prevList) => [...prevList, message.data!]);
          if (message.data.conversationId === activeConversationId) socket.emit('seen_message', message.data);
        }
      });
      socket.on('seen_message', (messageInfo: MessageType) => {
        console.log('seen_message received', messageInfo);
        notifyInfo('Message has been seen');
      });
    }

    return () => {
      socket?.off('message');
      socket?.off('seen_message');
    };
  }, [activeConversationId, socket]);

  useEffect(() => {
    mutateConversation();
  }, [messageList, mutateConversation]);

  return (
    <div className="card m-5 mb-0 flex flex-1 flex-col rounded-2xl pb-2 shadow-xl duration-200">
      {/* <div className="h-full w-full items-center justify-center">
        <Empty className="flex h-full flex-col items-center justify-center" />
      </div> */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-5">
          <Avatar
            size={42}
            icon={conversation?.isGroupChat && <HiOutlineUserGroup />}
            src={
              !conversation?.isGroupChat &&
              conversation?.participants?.find((member) => member?._id !== user?._id)?.avatar
            }
          />
          <div className="content flex flex-2 items-center justify-between">
            <div className="flex flex-col justify-center">
              <Typography.Text strong className="text-[1.4rem]">
                {conversation?.isGroupChat
                  ? conversation?.groupName
                  : conversation?.participants?.find((member) => member?._id !== user?._id)?.username}
              </Typography.Text>
              {/* <div className="flex gap-3">
                {conversation?.isGroupChat ? (
                  <Typography.Link onClick={handleShowMember}>
                    {conversation?.participants?.length} members
                  </Typography.Link>
                ) : (
                  <div className={`${userData?.data?.status && 'text-green-500'} flex items-center`}>
                    <GoDotFill size={18} />
                    <Typography.Text className={`inline tracking-tight ${userData?.data?.status && 'text-green-500'}`}>
                      {userData?.data?.status ? 'Online' : 'Offline ' + timeAgo(userData?.data?.lastOnline || '')}
                    </Typography.Text>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
        <div>
          <BsThreeDotsVertical size={22} />
        </div>
      </div>
      <Divider className="my-[8px]" />
      <div className="flex h-full flex-col-reverse gap-0 overflow-y-auto p-5">
        <div className="mt-auto flex flex-col gap-2">
          {messageList?.map((message) => <MessageItem message={message} />)}
        </div>
      </div>
      <MessagePageFooter conversationId={conversation?._id} setMessageList={setMessageList} />
    </div>
  );
};

export default MessagePageContent;
