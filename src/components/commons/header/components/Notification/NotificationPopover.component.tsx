import { useCallback, useEffect, useState } from 'react';
import { PiBell } from 'react-icons/pi';
import { useSocket } from '../../../../../context/SocketContext';
import { getNotifications } from '../../../../../services/notification/notification.service';
import { QueryOptions } from '../../../../../types/common';
import { NotificationType } from '../../../../../types/NotificationType';
import { notifyInfo } from '../../../../../utils/helpers/notify';
import { usePagination } from '../../../../../utils/hooks/usePagination.hook';
import { ComponentPopover } from '../IconPopover.component';
import NotificationComponent from './Notification.component';
import { useAppSelector } from '../../../../../redux/app/hook';
import { cn } from '../../../../../utils/helpers/cn';

const NotificationPopover = () => {
  const socket = useSocket();
  const { user } = useAppSelector((state) => state.user);
  const [queryOptionNotification, setQueryOptionNotification] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const {
    data: notificationData,
    refresh: mutateNotifications,
    isLoading: isLoadingNotifications
  } = usePagination<NotificationType[]>(
    `notification ${JSON.stringify(queryOptionNotification)}`,
    queryOptionNotification,
    () => getNotifications(queryOptionNotification)
  );
  const loadMoreNotification = useCallback(() => {
    if (isLoadingNotifications) return;
    setTimeout(() => {
      setQueryOptionNotification((prev) => ({ ...prev, pageSize: prev.pageSize! + 10 }));
    }, 1000);
  }, [isLoadingNotifications]);
  const allNotifications = notificationData?.data || [];
  const unreadNotifications = allNotifications?.filter((n: NotificationType) => !n.isSeen) || [];
  const unreadCount = unreadNotifications.length;
  let hasNotificationListener = false;

  useEffect(() => {
    if (socket && !hasNotificationListener) {
      hasNotificationListener = true;

      socket.on('receive_notification', (notification: NotificationType) => {
        if (notification.receivers.includes(user?._id as string)) {
          mutateNotifications();
          notifyInfo(notification.content);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_notification');
        hasNotificationListener = false;
      }
    };
  }, [mutateNotifications, socket, user?._id]);
  return (
    <ComponentPopover
      content={
        <NotificationComponent
          notification={notificationData!}
          mutate={mutateNotifications}
          loadMoreNotification={loadMoreNotification}
        />
      }
      isOpen={notificationsVisible}
      setOpen={setNotificationsVisible}
      icon={
        <PiBell
          size={25}
          // color={!notificationsVisible && 'text-[#4bc0f1]'}
          className={cn('duration-200 hover:text-[#64f6ee]', notificationsVisible && 'text-[#4bc0f1]')}
        />
      }
      placement="bottomRight"
      total={unreadCount}
    />
  );
};

export default NotificationPopover;
