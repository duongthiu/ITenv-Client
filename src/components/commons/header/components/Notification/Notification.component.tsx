import { Badge, Tabs, TabsProps, Typography } from 'antd';
import NotificationItem from './NotificationItem.component';
import './Notification.style.scss';
const NotificationComponent = () => {
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: `All`,
      children: <NotificationItem />
    },
    {
      key: '2',
      label: `Unread`,
      children: `Content of Tab Pane 2`
    }
  ];
  return (
    <div className="min-w-[300px]">
      <div className="flex gap-2 p-[12px] pb-0 text-[1.6rem] font-semibold">
        Notifications
        <Badge count={1} />
      </div>
      <div className="tab-wrapper">
        <Tabs items={tabItems} />
      </div>

      <div className="flex justify-center p-[12px]">
        <Typography.Link className="text-center">All notification</Typography.Link>
      </div>
    </div>
  );
};

export default NotificationComponent;
