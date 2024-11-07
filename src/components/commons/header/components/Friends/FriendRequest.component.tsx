import { Avatar, Button, Typography } from 'antd';
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { GoDotFill } from 'react-icons/go';
import { cn } from '../../../../../utils/helpers/cn';
import { FriendType } from '../../../../../types/FriendType';
import timeAgo from '../../../../../utils/helpers/timeAgo';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../../routes/paths';
import { notifyError, notifySuccess } from '../../../../../utils/helpers/notify';
import { acceptFriendRequest, rejectFriendRequest } from '../../../../../services/user/user.service';
import { useAppSelector } from '../../../../../redux/app/hook';
type FriendRequestItemProps = {
  friendRequest: FriendType;
  mutate: () => Promise<void>;
};
const FriendRequest: React.FC<FriendRequestItemProps> = ({ friendRequest, mutate }) => {
  const {user}= useAppSelector(state=>state.user)
  const handleRejectFriendRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (user?._id && friendRequest?._id) {
        const res = await rejectFriendRequest({ friendId: friendRequest?._id });
        if (res.success) {
          notifySuccess('Friend request rejected successfully');
        } else {
          notifyError('Failed to reject friend request');
        }
      }
    } catch (error) {
      notifyError('An error occurred');
    }
  };

  const handleAcceptFriendRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (friendRequest?._id) {
        const res = await acceptFriendRequest({ friendId: friendRequest?._id });
        if (res.success) {
          notifySuccess('Friend request accepted successfully');
          mutate();
        } else {
          notifyError('Failed to accept friend request');
        }
      }
    } catch (error) {
      notifyError('An error occurred');
    }
  };
  const navigate = useNavigate();
  return (
    <div
      className="link-hover cursor-pointer p-[12px] duration-200"
      onClick={() => navigate(paths.profile.replace(':userId', friendRequest?.sendBy?._id || ''))}
    >
      <div className="flex items-center gap-5">
        <Avatar size={42} icon={<UserOutlined />} />
        <div className="flex flex-2 items-center justify-between">
          <div className="flex flex-col">
            <Typography.Text>
              <Typography.Text strong>{friendRequest?.sendBy?.username}</Typography.Text> sent you a friend request
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
