import { Avatar, Typography } from 'antd';
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { cn } from '../../../../../utils/helpers/cn';
import { GoDotFill } from 'react-icons/go';
type NotificationItemProps = {
  isRead?: boolean;
};
const NotificationItem: React.FC<NotificationItemProps> = ({ isRead }) => {
  return (
    <div className="link-hover flex cursor-pointer items-center gap-5 p-[12px] duration-200">
      <Avatar size={42} icon={<UserOutlined />} />
      <div className="flex flex-2 items-center justify-between">
        <div className="flex flex-col">
          <Typography.Text strong>tranduongthieu</Typography.Text>
          <Typography.Text>tranduongthieu</Typography.Text>
        </div>
        <GoDotFill size={18} className={cn('text-primary-color', !isRead ? 'opacity-100' : 'opacity-0')} />
      </div>
    </div>
  );
};

export default NotificationItem;
