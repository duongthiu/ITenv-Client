import { Avatar, Button, Typography } from 'antd';
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { GoDotFill } from 'react-icons/go';
import { cn } from '../../../../../utils/helpers/cn';
type FriendRequestItemProps = {
  isRead?: boolean;
};
const FriendRequest: React.FC<FriendRequestItemProps> = ({ isRead }) => {
  return (
    <div className="link-hover cursor-pointer p-[12px] duration-200">
      <div className="flex items-center gap-5">
        <Avatar size={42} icon={<UserOutlined />} />
        <div className="flex flex-2 items-center justify-between">
          <div className="flex flex-col">
            <Typography.Text>
              <Typography.Text strong>tranduongthieu</Typography.Text> sent you a friend request
            </Typography.Text>
            <Typography.Text>1 hour ago</Typography.Text>
          </div>
          <GoDotFill size={18} className={cn('text-primary-color', !isRead ? 'opacity-100' : 'opacity-0')} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button type="primary">Accept</Button>
        <Button type="default">Decline</Button>
      </div>
    </div>
  );
};

export default FriendRequest;
