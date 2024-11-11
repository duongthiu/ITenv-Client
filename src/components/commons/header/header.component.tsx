import { Anchor, Form, Input } from 'antd';
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';
import React, { memo } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo/logo.png';
import { paths } from '../../../routes/paths';
import FriendPopover from './components/Friends/FriendPopover.component';
import MessagePopover from './components/Message/MessagePopover.component';
import NotificationPopover from './components/Notification/NotificationPopover.component';
import SettingsPopover from './components/Settings/SettingsPopover.component';
import './header.style.scss';

const HeaderComponent: React.FC = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  // const { data: notificationData, mutate: mutateNotifications } = useSWR('notification', () => getNotifications(''));

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

  return (
    <div className="header-wraper box fixed top-0 z-10 flex h-[60px] w-full justify-center shadow-md">
      <div className="flex h-full w-full max-w-[1440px] items-center justify-between px-5">
        <a href={paths.home} className="flex cursor-pointer items-center gap-2">
          <img src={logo} className="h-[32px] w-[32px]" style={{ userSelect: 'none' }} alt="Logo" />
          <h6 className="font-mono text-[2.2rem] font-extrabold" style={{ userSelect: 'none' }}>
            ITenv
          </h6>
        </a>
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
          <FriendPopover />
          <MessagePopover />
          <NotificationPopover />
          <SettingsPopover />
        </div>
      </div>
    </div>
  );
});

export default HeaderComponent;
