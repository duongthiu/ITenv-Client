import { useCallback, useEffect, useState } from 'react';
import { HiOutlineUsers } from 'react-icons/hi2';
import useSWR from 'swr';
import { setFriendRequests, setTotalFriendRequest } from '../../../../../redux/friend/friend.slice';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { getFriendRequests } from '../../../../../services/friend/friend.service';
import { QueryOptions } from '../../../../../types/common';
import { cn } from '../../../../../utils/helpers/cn';
import { ComponentPopover } from '../IconPopover.component';
import FriendsComponent from './Friends.component';

const FriendPopover = () => {
  const [friendsVisible, setFriendsVisible] = useState(false);
  const dispatch = useAppDispatch();
  const { friendRequests, total } = useAppSelector((state) => state.friend);
  const [queryOptionFriendRequest, setQueryOptionFriendRequest] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });
  const {
    data: friendRequestData,
    mutate: mutateFriendRequest,
    isLoading: isLoadingFriendRequest
  } = useSWR(`friend ${JSON.stringify(queryOptionFriendRequest)}`, () => {
    if (!friendRequests) return getFriendRequests(queryOptionFriendRequest);
  });

  const handleMutate = useCallback(async () => {
    await mutateFriendRequest();
  }, [mutateFriendRequest]);

  const loadMoreFriendRequest = useCallback(() => {
    if (isLoadingFriendRequest) return;
    setTimeout(() => {
      setQueryOptionFriendRequest((prev: any) => ({ ...prev, pageSize: prev.pageSize! + 10 }));
    }, 1000);
  }, [isLoadingFriendRequest]);

  useEffect(() => {
    if (friendRequestData?.data) {
      dispatch(setFriendRequests(friendRequestData?.data));
      dispatch(setTotalFriendRequest(friendRequestData?.total));
    }
  }, [dispatch, friendRequestData]);
  return (
    <ComponentPopover
      content={
        <FriendsComponent
          friendRequestData={friendRequests!}
          mutate={handleMutate}
          loadMoreFriendRequest={loadMoreFriendRequest}
          total={total}
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
      total={total}
    />
  );
};

export default FriendPopover;
