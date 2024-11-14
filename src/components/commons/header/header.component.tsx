import { Anchor, Button, Form } from 'antd';
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';
import React, { memo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo/logo.png';
import { setTheme, THEME } from '../../../redux/app/app.slice';
import { useAppDispatch, useAppSelector } from '../../../redux/app/hook';
import { paths } from '../../../routes/paths';
import FriendPopover from './components/Friends/FriendPopover.component';
import MessagePopover from './components/Message/MessagePopover.component';
import NotificationPopover from './components/Notification/NotificationPopover.component';
import SettingsPopover from './components/Settings/SettingsPopover.component';
import './header.style.scss';

const HeaderComponent: React.FC = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

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

  const handleNavigate = (e: React.MouseEvent<HTMLElement>, link: { title: React.ReactNode; href: string }) => {
    e.preventDefault();
    navigate(link.href);
  };

  useEffect(() => {
    if (location.pathname === paths.home) {
      dispatch(setTheme(THEME.LIGHT));
    }
  }, [location.pathname, dispatch]);

  return (
    // header-wraper box
    <div
      className={`fixed top-0 z-20 flex h-[60px] w-full justify-center shadow-md backdrop-blur-md ${location.pathname === paths.home ? 'bg-opacity-80 backdrop-blur-lg' : 'header-wraper box'}`}
    >
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
            <input
              placeholder="Search ITenv..."
              className="min-w-[300px] rounded-full border-[1px] border-transparent bg-[#f0f0f0] bg-opacity-50 px-5 py-3 text-black outline-none backdrop-blur-md duration-200 focus:border-primary-color focus:bg-opacity-100 focus:shadow-2xl"
            />
          </Form.Item>
        </Form>
        {user.isLogged ? (
          <div className="flex items-center gap-8">
            <FriendPopover />
            <MessagePopover />
            <NotificationPopover />
            <SettingsPopover />
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <Button href="/signup" type="default">
              Signup
            </Button>
            <Button href="/login" type="primary">
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

export default HeaderComponent;
