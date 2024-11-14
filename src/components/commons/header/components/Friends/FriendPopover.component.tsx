import { useCallback, useEffect, useState } from 'react';
import { HiOutlineUsers } from 'react-icons/hi2';
import { FriendType } from '../../../../../types/FriendType';
import { cn } from '../../../../../utils/helpers/cn';
import { usePagination } from '../../../../../utils/hooks/usePagination.hook';
import { ComponentPopover } from '../IconPopover.component';
import FriendsComponent from './Friends.component';
import { QueryOptions } from '../../../../../types/common';
import { useSocket } from '../../../../../context/SocketContext';
import { NotificationType } from '../../../../../types/NotificationType';
import { useAppSelector } from '../../../../../redux/app/hook';
import { notifyInfo } from '../../../../../utils/helpers/notify';
import { getFriendRequests } from '../../../../../services/friend/friend.service';

const FriendPopover = () => {
  const socket = useSocket();
  const { user } = useAppSelector((state) => state.user);
  const [friendsVisible, setFriendsVisible] = useState(false);

  const [queryOptionFriendRequest, setQueryOptionFriendRequest] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });
  const {
    data: friendRequestData,
    refresh: mutateFriendRequest,
    isLoading: isLoadingFriendRequest
  } = usePagination<FriendType[]>(`friend ${JSON.stringify(queryOptionFriendRequest)}`, queryOptionFriendRequest, () =>
    getFriendRequests(queryOptionFriendRequest)
  );
  const loadMoreFriendRequest = useCallback(() => {
    if (isLoadingFriendRequest) return;
    setTimeout(() => {
      setQueryOptionFriendRequest((prev: any) => ({ ...prev, pageSize: prev.pageSize! + 10 }));
    }, 1000);
  }, [isLoadingFriendRequest]);
  let hasNotificationListener = false;
  useEffect(() => {
    if (socket && !hasNotificationListener) {
      hasNotificationListener = true;
      socket.on('receive_notification_friend', (notification: NotificationType) => {
        if (notification.receivers.includes(user?._id as string)) {
          mutateFriendRequest();
          notifyInfo(notification.content);
        }
      });
    }
    return () => {
      if (socket) {
        socket.off('receive_notification_friend');
        hasNotificationListener = false;
      }
    };
  }, [mutateFriendRequest, socket, user?._id]);
  return (
    <ComponentPopover
      content={
        <FriendsComponent
          friendRequestData={friendRequestData!}
          mutate={mutateFriendRequest}
          loadMoreFriendRequest={loadMoreFriendRequest}
        />
      }
      isOpen={friendsVisible}
      setOpen={setFriendsVisible}
      icon={
        <HiOutlineUsers
          size={28}
          // color={!friendsVisible && '#4bc0f1'}
          className={cn('duration-200 hover:text-[#64f6ee]', friendsVisible && 'text-[#4bc0f1]')}
        />
      }
      placement="bottomRight"
      total={friendRequestData?.total || 0}
    />
  );
};

export default FriendPopover;
