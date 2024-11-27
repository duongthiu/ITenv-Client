import { Badge, Divider, Empty, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FriendType } from '../../../../../types/FriendType';
import FriendRequest from './FriendRequest.component';

type FriendsComponentProps = {
  friendRequestData: FriendType[];
  mutate: () => Promise<void>;
  loadMoreFriendRequest: () => void;
  total: number;
};

const FriendsComponent: React.FC<FriendsComponentProps> = ({
  friendRequestData,
  mutate,
  loadMoreFriendRequest,
  total
}) => {
  const allRequests = friendRequestData || [];
  return (
    <div className="w-[350px]" style={{ maxHeight: '500px', overflow: 'auto' }}>
      <div className="flex gap-2 pb-0 text-[1.6rem] font-semibold">
        <div className="flex gap-2 p-[12px] pb-0 text-[1.6rem] font-semibold">
          Friend Requests
          <Badge count={total} />
        </div>
      </div>
      <Divider className="my-[12px]" />
      <InfiniteScroll
        dataLength={allRequests.length}
        next={loadMoreFriendRequest}
        hasMore={(friendRequestData?.length ?? 0) < (total ?? 0)}
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
