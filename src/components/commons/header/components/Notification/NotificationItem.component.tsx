import { Avatar, Typography } from 'antd';
import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { cn } from '../../../../../utils/helpers/cn';
import { GoDotFill } from 'react-icons/go';
import { NotificationType } from '../../../../../types/NotificationType';
import timeAgo from '../../../../../utils/helpers/timeAgo';
import PreviewTextEditorComponent from '../../../../TextEditor/components/PreviewTextEditor.component.tdc';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../../routes/paths';
import { seenNotification } from '../../../../../services/notification/notification.service';
import { KeyedMutator } from 'swr';
import { ResponsePagination } from '../../../../../types/common';
type NotificationItemProps = {
  notification: NotificationType;
  mutate: KeyedMutator<ResponsePagination<NotificationType[]>>;
};
const NotificationItem: React.FC<NotificationItemProps> = ({ notification, mutate }) => {
  console.log(notification);
  const navigate = useNavigate();
  const handleSeenNotification = async () => {
    const resp = await seenNotification({ notificationId: notification._id! });
    if (resp.success) {
      mutate();
      navigate(paths.detailDiscuss2.replace(':id', notification?.postId || ''));
    }
  };
  return (
    <div
      className={`link-hover flex cursor-pointer items-start gap-5 p-[12px] duration-200 ${notification.isSeen ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => handleSeenNotification()}
    >
      <Avatar
        size={42}
        icon={
          notification?.postedBy?.avatar ? <img src={notification?.postedBy?.avatar} alt="avatar" /> : <UserOutlined />
        }
      />
      <div className="notify-wrapper flex w-full flex-2 items-center justify-between">
        <div className="flex flex-col">
          <p>{notification?.title}</p>
          <PreviewTextEditorComponent content={notification?.content} inline fontSize={1.4} lineHeight={1.4} />
          <p className="opacity-50">{timeAgo(notification.createdAt!)}</p>
        </div>
        <GoDotFill size={18} className={cn('text-primary-color', !notification.isSeen ? 'opacity-100' : 'opacity-0')} />
      </div>
    </div>
  );
};

export default NotificationItem;
