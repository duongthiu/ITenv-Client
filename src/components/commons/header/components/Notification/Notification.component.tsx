import { Badge, Empty, Tabs, Typography } from 'antd';
import { NotificationType } from '../../../../../types/NotificationType';
import { ResponsePagination } from '../../../../../types/common';
import './Notification.style.scss';
import NotificationItem from './NotificationItem.component';
import { KeyedMutator } from 'swr';

type NotificationProps = {
  notification: ResponsePagination<NotificationType[]>;
  mutate: KeyedMutator<ResponsePagination<NotificationType[]>>;
};

const NotificationComponent: React.FC<NotificationProps> = ({ notification, mutate }) => {
  const allNotifications = notification?.data || [];
  const unreadNotifications = allNotifications.filter((n) => !n.isSeen);
  const unreadCount = unreadNotifications.length;

  const tabItems = [
    {
      key: '1',
      label: 'All',
      children:
        allNotifications.length > 0 ? (
          allNotifications.map((notif) => <NotificationItem key={notif._id} notification={notif} mutate={mutate} />)
        ) : (
          <Empty description="No notifications" />
        )
    },
    {
      key: '2',
      label: `Unread`,
      children:
        unreadNotifications.length > 0 ? (
          unreadNotifications.map((notif) => <NotificationItem key={notif._id} notification={notif} mutate={mutate} />)
        ) : (
          <Empty description="No unread notifications" />
        )
    }
  ];

  return (
    <div className="notification-component w-[350px]">
      <div className="flex gap-2 p-[12px] pb-0 text-[1.6rem] font-semibold">
        Notifications
        <Badge count={unreadCount} />
      </div>
      <div className="tab-wrapper max-h-[500px] overflow-y-auto">
        <Tabs items={tabItems} />
      </div>
      <div className="flex justify-center p-3">
        <Typography.Link className="text-center">All notifications</Typography.Link>
      </div>
    </div>
  );
};

export default NotificationComponent;
