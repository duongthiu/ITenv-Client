import { Badge, Divider, Empty, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ResponsePagination } from '../../../../../types/common';
import { FriendType } from '../../../../../types/FriendType';
import FriendRequest from './FriendRequest.component';

type FriendsComponentProps = {
  friendRequestData: ResponsePagination<FriendType[]>;
  mutate: () => Promise<void>;
  loadMoreFriendRequest: () => void;
};

const FriendsComponent: React.FC<FriendsComponentProps> = ({ friendRequestData, mutate, loadMoreFriendRequest }) => {
  const allRequests = friendRequestData?.data || [];
  console.log(friendRequestData?.total);
  return (
    <div className="w-[350px]">
      <div className="flex gap-2 pb-0 text-[1.6rem] font-semibold">
        <div className="flex gap-2 p-[12px] pb-0 text-[1.6rem] font-semibold">
          Friend Requests
          <Badge count={friendRequestData?.total} />
        </div>
      </div>
      <Divider className="my-[12px]" />
      <InfiniteScroll
        dataLength={allRequests.length}
        next={loadMoreFriendRequest}
        hasMore={(friendRequestData?.data?.length ?? 0) < (friendRequestData?.total ?? 0)}
        loader={
          <div className="p-[12px]">
            <Skeleton active paragraph={{ rows: 1 }} />
          </div>
        }
        scrollThreshold={0.9}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={allRequests}
          renderItem={(friendRequest) => (
            <FriendRequest key={friendRequest._id} friendRequest={friendRequest} mutate={mutate} />
          )}
          locale={{ emptyText: <Empty description="No friend requests" /> }}
        />
      </InfiniteScroll>
    </div>
  );
};

export default FriendsComponent;
