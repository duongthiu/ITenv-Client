import { Anchor, Badge, Button, Form, Input, Popover } from 'antd';
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';
import { TooltipPlacement } from 'antd/es/tooltip';
import React, { memo, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react';
import { HiOutlineUsers } from 'react-icons/hi2';
import { IoSearchOutline } from 'react-icons/io5';
import { PiBell, PiMessengerLogo } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo/logo.png';
import { useSocket } from '../../../context/SocketContext';
import { paths } from '../../../routes/paths';
import { getNotifications } from '../../../services/notification/notification.service';
import { QueryOptions } from '../../../types/common';
import { NotificationType } from '../../../types/NotificationType';
import { cn } from '../../../utils/helpers/cn';
import { notifyInfo } from '../../../utils/helpers/notify';
import { usePagination } from '../../../utils/hooks/usePagination.hook';
import FriendsComponent from './components/Friends/Friends.component';
import MessageComponent from './components/Message/Message.component';
import NotificationComponent from './components/Notification/Notification.component';
import SettingsComponent from './components/Settings/Settings.component';
import './header.style.scss';
import { FriendType } from '../../../types/FriendType';
import { getFriendRequests } from '../../../services/user/user.service';
import { ConversationType } from '../../../types/ConversationType';
import { getConversationsByUserId } from '../../../services/conversation/conversation.service';

interface ComponentPopoverProps {
  content: ReactNode;
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  icon: ReactNode;
  placement: TooltipPlacement;
  total?: number;
}

const ComponentPopover: React.FC<ComponentPopoverProps> = ({
  content,
  isOpen,
  setOpen,
  icon,
  placement,
  total = 0
}) => (
  <Popover
    rootClassName="popover-wrapper"
    placement={placement || 'bottom'}
    content={content}
    trigger="click"
    arrow={false}
    className="popover-notification cursor-pointer"
    overlayClassName="max-w-[45rem] max-h-[40rem] p-0"
    autoAdjustOverflow={false}
    open={isOpen}
    onOpenChange={(visible) => setOpen(visible)}
  >
    <Badge count={total}>{icon}</Badge>
  </Popover>
);

const HeaderComponent: React.FC = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const socket = useSocket();
  const { user, isLogged } = useSelector((state: any) => state.user);
  const [friendsVisible, setFriendsVisible] = useState(false);
  const [messagesVisible, setMessagesVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  // const { data: notificationData, mutate: mutateNotifications } = useSWR('notification', () => getNotifications(''));
  const [queryOptionNotification, setQueryOptionNotification] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });
  const [queryOptionFriendRequest, setQueryOptionFriendRequest] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });
  const [queryOptionConversation, setQueryOptionConversation] = useState<QueryOptions>({
    page: 1,
    pageSize: 20
  });

  const {
    data: conversationData,
    refresh: mutateConversation,
    isLoading: isLoadingConversation
  } = usePagination<ConversationType[]>(
    `conversation ${JSON.stringify(queryOptionConversation)}`,
    queryOptionConversation,
    () => getConversationsByUserId(queryOptionConversation)
  );

  const {
    data: notificationData,
    refresh: mutateNotifications,
    isLoading: isLoadingNotifications
  } = usePagination<NotificationType[]>(
    `notification ${JSON.stringify(queryOptionNotification)}`,
    queryOptionNotification,
    () => getNotifications(queryOptionNotification)
  );

  const {
    data: friendRequestData,
    refresh: mutateFriendRequest,
    isLoading: isLoadingFriendRequese
  } = usePagination<FriendType[]>(`friend ${JSON.stringify(queryOptionFriendRequest)}`, queryOptionFriendRequest, () =>
    getFriendRequests(queryOptionFriendRequest)
  );
  const allNotifications = notificationData?.data || [];
  const unreadNotifications = allNotifications?.filter((n: NotificationType) => !n.isSeen) || [];
  const unreadCount = unreadNotifications.length;
  useEffect(() => {});
  const menuItems: AnchorLinkItemProps[] = [
    {
      key: 'problems',
      title: 'Problems',
      href: '/problems'
    },
    {
      key: 'contest',
      title: 'Coding Meeting',
      href: '/contest'
    },
    {
      key: 'discuss',
      title: 'Discuss',
      href: '/discuss'
    }
  ];
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
  const handleSearch = (values: any) => {
    if (values.search.trim()) {
      const searchQuery = values?.search ? `?q=${values.search.trim()}` : '';
      navigate(`/search${searchQuery}`);
    }
  };

  const handleNavigate = (
    e: React.MouseEvent<HTMLElement>,
    link: {
      title: React.ReactNode;
      href: string;
    }
  ) => {
    e.preventDefault();
    navigate(link.href);
  };

  const loadMoreNotification = useCallback(() => {
    if (isLoadingNotifications) return;
    setTimeout(() => {
      setQueryOptionNotification((prev) => ({ ...prev, pageSize: prev.pageSize! + 10 }));
    }, 1000);
  }, [isLoadingNotifications]);

  const loadMoreFriendRequest = useCallback(() => {
    if (isLoadingFriendRequese) return;
    setTimeout(() => {
      setQueryOptionFriendRequest((prev) => ({ ...prev, pageSize: prev.pageSize! + 10 }));
    }, 1000);
  }, [isLoadingFriendRequese]);

  return (
    <div className="header-wraper box fixed top-0 z-10 flex h-[60px] w-full justify-center shadow-md">
      <div className="flex h-full w-full max-w-[1440px] items-center justify-between px-5">
        <div onClick={() => navigate(paths.home)} className="flex cursor-pointer items-center gap-2">
          <img src={logo} className="h-[32px] w-[32px]" style={{ userSelect: 'none' }} alt="Logo" />
          <h6 className="font-mono text-[2.2rem] font-extrabold" style={{ userSelect: 'none' }}>
            ITenv
          </h6>
        </div>
        <div className="anchor-wrapper">
          <Anchor
            onClick={handleNavigate}
            direction="horizontal"
            items={menuItems}
            getCurrentAnchor={() => location.pathname}
          />
        </div>
        <Form onFinish={handleSearch}>
          <Form.Item style={{ margin: 0 }} name={'search'}>
            <Input prefix={<IoSearchOutline />} placeholder="Search ITenv..." size="middle" />
          </Form.Item>
        </Form>
        <div className="flex items-center gap-8">
          <ComponentPopover
            content={
              <FriendsComponent
                friendRequestData={friendRequestData!}
                mutate={mutateFriendRequest}
                loadMoreFriendRequest={loadMoreFriendRequest}
              />
            }
            isOpen={friendsVisible}
            setOpen={setFriendsVisible}
            icon={
              <HiOutlineUsers
                size={28}
                // color={!friendsVisible && '#4bc0f1'}
                className={cn('duration-200 hover:text-[#64f6ee]', friendsVisible && 'text-[#4bc0f1]')}
              />
            }
            placement="bottomRight"
            total={friendRequestData?.total || 0}
          />
          <ComponentPopover
            content={<MessageComponent conversations={conversationData!} mutate={mutateConversation} />}
            isOpen={messagesVisible}
            setOpen={setMessagesVisible}
            icon={
              <PiMessengerLogo
                size={25}
                // color={!messagesVisible && 'text-[#4bc0f1]'}
                className={cn('duration-200 hover:text-[#64f6ee]', messagesVisible && 'text-[#4bc0f1]')}
              />
            }
            placement="bottomRight"
          />
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

          {!isLogged ? (
            <Button href="/login" type="primary">
              Login
            </Button>
          ) : (
            <Popover
              placement="bottomRight"
              content={<SettingsComponent />}
              trigger="click"
              arrow={false}
              className="popover-notification cursor-pointer"
              overlayClassName="max-w-[45rem] max-h-[40rem] p-0"
              autoAdjustOverflow={false}
              open={settingsVisible}
              onOpenChange={(visible) => setSettingsVisible(visible)}
            >
              <img src={user?.avatar} alt="" className="h-[32px] w-[32px] rounded-full object-cover" />
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
});

export default HeaderComponent;
