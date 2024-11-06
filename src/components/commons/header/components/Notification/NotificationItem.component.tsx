import { Avatar, Typography } from 'antd';
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { cn } from '../../../../../utils/helpers/cn';
import { GoDotFill } from 'react-icons/go';
import { NotificationType } from '../../../../../types/NotificationType';
import timeAgo from '../../../../../utils/helpers/timeAgo';
import PreviewTextEditorComponent from '../../../../TextEditor/components/PreviewTextEditor.component.tdc';
type NotificationItemProps = {
  notification: NotificationType;
};
const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  console.log(notification);
  return (
    <div className="link-hover flex cursor-pointer items-start gap-5 p-[12px] duration-200">
      <Avatar
        size={42}
        icon={
          notification?.postedBy?.avatar ? <img src={notification?.postedBy?.avatar} alt="avatar" /> : <UserOutlined />
        }
      />
      <div className="flex w-full flex-2 items-center justify-between">
        <div className="flex flex-col">
          <p>{notification?.title}</p>
          <PreviewTextEditorComponent content={notification?.content} inline />
          <p className="opacity-50">{timeAgo(notification.createdAt!)}</p>
        </div>
        <GoDotFill
          size={18}
          className={cn('text-primary-color', !notification?.isSeen ? 'opacity-100' : 'opacity-0')}
        />
      </div>
    </div>
  );
};

export default NotificationItem;
