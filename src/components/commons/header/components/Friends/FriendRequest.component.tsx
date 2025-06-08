import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Typography } from 'antd';

import { GoDotFill } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../../routes/paths';
import { FriendType } from '../../../../../types/FriendType';
import { cn } from '../../../../../utils/helpers/cn';
import timeAgo from '../../../../../utils/helpers/timeAgo';
import { useFriendAction } from '../../../../../utils/hooks/useFriendAction.hook';
type FriendRequestItemProps = {
  friendRequest: FriendType;
  mutate: () => Promise<void>;
};
const FriendRequest: React.FC<FriendRequestItemProps> = ({ friendRequest, mutate }) => {
  const { handleRejectFriendRequest, handleAcceptFriendRequest } = useFriendAction({
    userId: friendRequest?.sentBy?._id,
    relationshipId: friendRequest?._id,
    mutate
  });
  const navigate = useNavigate();
  return (
    <div
      className="link-hover cursor-pointer p-[12px] duration-200"
      onClick={() => navigate(paths.profile.replace(':userId', friendRequest?.sentBy?._id || ''))}
    >
      <div className="flex items-center gap-5">
        <Avatar size={42} icon={<UserOutlined />} />
        <div className="flex flex-2 items-center justify-between">
          <div className="flex flex-col">
            <Typography.Text>
              <Typography.Text strong>{friendRequest?.sentBy?.username}</Typography.Text> sent you a friend request
            </Typography.Text>
            <p className="opacity-50">{timeAgo(friendRequest.createdAt!)}</p>
          </div>
          <GoDotFill size={18} className={cn('text-primary-color', 'opacity-100')} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button type="primary" onClick={handleAcceptFriendRequest}>
          Accept
        </Button>
        <Button type="default" onClick={handleRejectFriendRequest}>
          Decline
        </Button>
      </div>
    </div>
  );
};

export default FriendRequest;
