import { Avatar, Divider, Modal, Skeleton, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { GoDotFill } from 'react-icons/go';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useAppDispatch, useAppSelector } from '../../../../redux/app/hook';
import { setCurrentMessageList } from '../../../../redux/message/message.slice';
import { paths } from '../../../../routes/paths';
import { getMessageByConversationId } from '../../../../services/message/message.service';
import { QueryOptions } from '../../../../types/common';
import { ConversationType } from '../../../../types/ConversationType';
import timeAgo from '../../../../utils/helpers/timeAgo';
import MessageItem from '../components/MessageItem/MessageItem';
import MessagePageFooter from '../components/MessagePageFooter/MessagePageFooter.component';

type MessagePageContentProps = {
  conversation?: ConversationType;
  receiverId?: string;
  activeConversationId: string;
};

const MessagePageContent: React.FC<MessagePageContentProps> = ({ conversation, activeConversationId }) => {
  const { user } = useAppSelector((state) => state.user);
  const { currentMessageList } = useAppSelector((state) => state.conversation);
  const [openMemberModal, setOpenMemberModal] = useState<boolean>(false);
  const [isLoadmore, setIsLoadmore] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [queryOptionMessage, setQueryOptionMessage] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });

  const {
    data: messageData,
    mutate: mutateMessage,
    isLoading: isLoadingMessage
  } = useSWR(`messages/${activeConversationId}/${JSON.stringify(queryOptionMessage)}`, () =>
    getMessageByConversationId(activeConversationId || '', queryOptionMessage)
  );
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreMessages = () => {
    setIsLoadmore(true);
    if (messageData?.data && messageData?.data.length > 0) {
      setTimeout(() => {
        setQueryOptionMessage((prev) => ({
          ...prev,
          pageSize: (prev?.pageSize || 0) + 20
        }));
        setIsLoadmore(false);
      }, 1000);
    }
  };
  // IntersectionObserver callback
  const intersectionCallback = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && !isLoadingMessage && (queryOptionMessage?.pageSize || 0) < (messageData?.total || 0)) {
      loadMoreMessages();
    }
  };

  // Set up IntersectionObserver when component mounts
  useEffect(() => {
    observer.current = new IntersectionObserver(intersectionCallback, {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 1.0 // Trigger when the sentinel is fully in view
    });

    const sentinel = document.getElementById('sentinel');
    if (sentinel) {
      observer.current.observe(sentinel);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [messageData?.data, isLoadingMessage]);

  useEffect(() => {
    dispatch(setCurrentMessageList([]));
    if (activeConversationId) {
      mutateMessage();
    }
  }, [activeConversationId, mutateMessage]);

  useEffect(() => {
    if (messageData?.data) {
      dispatch(setCurrentMessageList(messageData?.data));
    }
  }, [messageData?.data]);

  const conversationInfo = conversation?.participants?.find((member) => member?._id !== user?._id);

  return (
    <div className="card m-5 mb-0 flex flex-1 flex-col rounded-2xl pb-2 shadow-xl duration-200">
      {conversation?.isGroupChat && (
        <Modal
          title={<span className="text-[1.8rem]">Members</span>}
          open={openMemberModal}
          onCancel={() => setOpenMemberModal(false)}
          footer={null}
        >
          <Divider className="my-4" />
          <div className="flex flex-col gap-5">
            {conversation?.participants?.map((member) => (
              <div
                key={member?._id}
                className="flex cursor-pointer items-center gap-4"
                onClick={() => navigate(paths.profile.replace(':userId', member?._id))}
              >
                <div className="relative">
                  {member?.status && (
                    <div className={`absolute -bottom-1 right-0 flex items-center text-green-500`}>
                      <div className="h-4 w-4 rounded-full border-[1px] border-white bg-green-500"></div>
                    </div>
                  )}
                  <Avatar size={42} icon={conversation?.isGroupChat && <HiOutlineUserGroup />} src={member.avatar} />
                </div>
                <Typography.Text>{member.username}</Typography.Text>
              </div>
            ))}
          </div>
        </Modal>
      )}

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
              <div className="flex gap-3">
                {conversation?.isGroupChat ? (
                  <Typography.Link className="text-[1.2rem]" onClick={() => setOpenMemberModal(true)}>
                    {conversation?.participants?.length} members
                  </Typography.Link>
                ) : (
                  <div className={`${conversationInfo?.status && 'text-green-500'} flex items-center`}>
                    <GoDotFill size={18} />
                    <Typography.Text
                      className={`inline text-[1.2rem] tracking-tight ${conversationInfo?.status && 'text-green-500'}`}
                    >
                      {conversationInfo?.status ? 'Online' : 'Offline ' + timeAgo(conversationInfo?.lastOnline || '')}
                    </Typography.Text>
                  </div>
                )}
              </div>
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
          {currentMessageList?.map((message) => <MessageItem key={message._id} message={message} />)}
        </div>
        {isLoadmore && <Skeleton avatar title className="my-3 w-full" />}
        {/* Sentinel Element */}
        <div id="sentinel" />
      </div>
      <MessagePageFooter conversationId={activeConversationId} />
    </div>
  );
};

export default MessagePageContent;
