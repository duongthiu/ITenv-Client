/* eslint-disable react-hooks/exhaustive-deps */
import { Divider, Skeleton } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useAppDispatch, useAppSelector } from '../../../../redux/app/hook';
import { setCurrentMessageList } from '../../../../redux/message/message.slice';
import { getMessageByConversationId } from '../../../../services/message/message.service';
import { QueryOptions } from '../../../../types/common';
import { ConversationType } from '../../../../types/ConversationType';
import MessageItem from '../components/MessageItem/MessageItem';
import MessagePageFooter from '../components/MessagePageFooter/MessagePageFooter.component';
import Header from './components/header.component';

type MessagePageContentProps = {
  conversation?: ConversationType;
  receiverId?: string;
  activeConversationId: string;
};

const MessagePageContent: React.FC<MessagePageContentProps> = ({ conversation, activeConversationId }) => {
  const { currentMessageList } = useAppSelector((state) => state.conversation);
  const [isLoadmore, setIsLoadmore] = useState(false);
  const dispatch = useAppDispatch();
  const [queryOptionMessage, setQueryOptionMessage] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });

  const {
    data: messageData,
    mutate: mutateMessage,
    isLoading: isLoadingMessage
  } = useSWR(`messages/${activeConversationId}/${JSON.stringify(queryOptionMessage)}`, () => {
    if (activeConversationId) return getMessageByConversationId(activeConversationId || '', queryOptionMessage);
  });
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

  return (
    <div className="card m-5 mb-0 flex flex-1 flex-col rounded-2xl pb-2 shadow-xl duration-200">
      <Header conversation={conversation!} />
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
