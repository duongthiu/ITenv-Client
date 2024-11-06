import { Badge, Tabs, TabsProps, Typography } from 'antd';
import { NotificationType } from '../../../../../types/NotificationType';
import { ResponsePagination } from '../../../../../types/common';
import './Notification.style.scss';
import NotificationItem from './NotificationItem.component';
type NotificationProps = {
  notification: ResponsePagination<NotificationType[]>;
};
const NotificationComponent: React.FC<NotificationProps> = ({ notification }) => {
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: `All`,
      children: notification?.data?.map((notification: NotificationType) => (
        <NotificationItem key={notification?._id} notification={notification} />
      )) || <div>No notifications</div>
    },
    {
      key: '2',
      label: `Unread`,
      children: notification?.data
        ?.filter((notification: NotificationType) => !notification.isSeen)
        .map((notification: NotificationType) => (
          <NotificationItem key={notification?._id} notification={notification} />
        )) || <div>No unread notifications</div>
    }
  ];

  return (
    <div className="min-w-[300px]">
      <div className="flex gap-2 p-[12px] pb-0 text-[1.6rem] font-semibold">
        Notifications
        {/* <Badge count={data?.data?.filter((notification: NotificationType) => !notification.isSeen).length} /> */}
        <Badge count={notification?.total} />
      </div>
      <div className="tab-wrapper max-h-[500px] overflow-y-auto">
        <Tabs items={tabItems} />
      </div>
      <div className="flex justify-center p-[12px]">
        <Typography.Link className="text-center">All notifications</Typography.Link>
      </div>
    </div>
  );
};

export default NotificationComponent;
