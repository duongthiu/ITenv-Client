import { Badge, Empty, List, Skeleton, Tabs } from 'antd';
import { memo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NotificationType } from '../../../../../types/NotificationType';
import { ResponsePagination } from '../../../../../types/common';
import './Notification.style.scss';
import NotificationItem from './NotificationItem.component';

type NotificationProps = {
  notification: ResponsePagination<NotificationType[]>;
  mutate: () => Promise<void>;
  loadMoreNotification: () => void;
};

const NotificationComponent: React.FC<NotificationProps> = memo(({ notification, mutate, loadMoreNotification }) => {
  const allNotifications = notification?.data || [];
  const unreadNotifications = allNotifications.filter((n) => !n.isSeen);
  const unreadCount = unreadNotifications.length;

  const renderInfiniteList = (notifications: NotificationType[]) => (
    <InfiniteScroll
      dataLength={notifications.length}
      next={loadMoreNotification}
      hasMore={(notification?.data?.length || 0) < (notification?.total || 0)}
      loader={
        <div className="p-[12px]">
          <Skeleton avatar paragraph={{ rows: 1 }} active />
        </div>
      }
      scrollableTarget="scrollableDiv"
    >
      <List
        dataSource={notifications}
        renderItem={(notif) => <NotificationItem key={notif._id} notification={notif} mutate={mutate} />}
        locale={{ emptyText: <Empty description="No notifications" /> }}
      />
    </InfiniteScroll>
  );

  const tabItems = [
    {
      key: '1',
      label: 'All',
      children: renderInfiniteList(allNotifications)
    },
    {
      key: '2',
      label: 'Unread',
      children: renderInfiniteList(unreadNotifications)
    }
  ];

  return (
    <div
      className="notification-component w-[350px]"
      id="scrollableDiv"
      style={{ maxHeight: '500px', overflow: 'auto' }}
    >
      <div className="flex gap-2 p-[12px] pb-0 text-[1.6rem] font-semibold">
        Notifications
        <Badge count={unreadCount} />
      </div>
      <div className="tab-wrapper">
        <Tabs items={tabItems} />
      </div>
    </div>
  );
});

export default NotificationComponent;
