import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

import { GoDotFill } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../../routes/paths';
import { seenNotification } from '../../../../../services/notification/notification.service';
import { NotificationType } from '../../../../../types/NotificationType';
import { cn } from '../../../../../utils/helpers/cn';
import timeAgo from '../../../../../utils/helpers/timeAgo';
import PreviewTextEditorComponent from '../../../../TextEditor/components/PreviewTextEditor.component.tdc';
import { NotificationTypeEnum } from '../../../../../types/enum/notification.enum';
import { useAppDispatch } from '../../../../../redux/app/hook';
import { seenNotificationAction } from '../../../../../redux/notification/notification.slice';
type NotificationItemProps = {
  notification: NotificationType;
};
const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleSeenNotification = async () => {
    const resp = await seenNotification({ notificationId: notification._id! });
    if (resp.success) {
      dispatch(seenNotificationAction(notification._id!));
      if (
        notification.notificationType === NotificationTypeEnum.ACCEPT_FRIEND_REQUEST ||
        notification.notificationType === NotificationTypeEnum.REJECT_FRIEND_REQUEST
      )
        navigate(paths.profile.replace(':userId', notification?.receivers[0] || ''));
      else if (
        notification.notificationType !== NotificationTypeEnum.ADMIN_NOTIFICATION &&
        notification.notificationType !== NotificationTypeEnum.OTHER_NOTIFICATION
      )
        navigate(paths.detailDiscuss2.replace(':id', notification?.postId || ''));
    }
  };

  return (
    <div
      className={`link-hover flex h-full cursor-pointer items-start gap-5 p-[12px] duration-200 ${notification.isSeen ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => handleSeenNotification()}
    >
      <Avatar
        size={42}
        icon={
          notification?.postedBy?.avatar ? <img src={notification?.postedBy?.avatar} alt="avatar" /> : <UserOutlined />
        }
      />
      <div className="notify-wrapper flex w-full flex-2 items-center justify-between">
        <div className="flex h-full flex-col">
          <p>{notification?.title}</p>
          <PreviewTextEditorComponent
            content={notification?.content}
            inline
            fontSize="sm"
            className="w-full overflow-y-hidden"
          />
          <p className="opacity-50">{timeAgo(notification.createdAt!)}</p>
        </div>
        <GoDotFill size={18} className={cn('text-primary-color', !notification.isSeen ? 'opacity-100' : 'opacity-0')} />
      </div>
    </div>
  );
};

export default NotificationItem;
