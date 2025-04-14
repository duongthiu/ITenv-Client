import { Avatar, Divider, List } from 'antd';

import { CiLogout, CiSettings } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { logout } from '../../../../../redux/user/user.slice';
import { paths } from '../../../../../routes/paths';
import { setTheme, THEME, toggleChatBox } from '../../../../../redux/app/app.slice';
import { GoMoon } from 'react-icons/go';
import { RiRobot2Line } from 'react-icons/ri';
// const menuItems = [
//   label: 'Profile',
// ]
type SettingMenuItemType = {
  id: string;
  icon: JSX.Element;
  label: string;
  onClick?: () => void;
};

const SettingsComponent = () => {
  const { user } = useAppSelector((state) => state.user);
  const { theme, isChatBoxVisible } = useAppSelector((state) => state.app);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const toggleTheme = () => {
    dispatch(setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };
  const menuItems: SettingMenuItemType[] = [
    {
      id: 'settings',
      icon: <CiSettings size={20} />,
      label: 'Settings',
      onClick: () => {
        navigate(paths.editProfile.replace(':tab', ''));
      }
    },
    {
      id: 'theme',
      icon: <GoMoon size={20} />,
      label: (
        <div className="flex flex-1 justify-between">
          <div>Dark Mode </div>
          <div className="opacity-50">{theme === THEME.DARK ? 'On' : 'Off'}</div>
        </div>
      ) as any as string,
      onClick: () => {
        toggleTheme();
      }
    },
    {
      id: 'chat',
      icon: <RiRobot2Line size={20} />,
      label: (
        <div className="flex flex-1 justify-between">
          <div>Chat Assistant </div>
          <div className="opacity-50">{isChatBoxVisible ? 'On' : 'Off'}</div>
        </div>
      ) as any as string,
      onClick: () => {
        dispatch(toggleChatBox());
      }
    },
    {
      id: 'logout',
      icon: <CiLogout size={20} />,
      label: 'Logout',
      onClick: () => {
        dispatch(logout());
      }
    }
  ];
  return (
    <div className="min-w-[300px]">
      <List
        className="p-1"
        children={
          <div>
            <Link
              to={paths.profile.replace(':userId', user?._id || '')}
              className="link-hover flex cursor-pointer items-center gap-4 rounded-lg p-2 text-current duration-500"
            >
              <Avatar size={36} src={user?.avatar} />
              <div className="flex flex-col justify-center">
                <span className="text-[1.65rem] font-semibold">{user?.username}</span>
                <span className="w-full truncate text-[1.4rem] font-light">{user?.email}</span>
              </div>
            </Link>
            <Divider className="my-2" />
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="link-hover flex cursor-pointer items-center gap-5 rounded-lg px-2 py-3 text-[1.6rem] font-semibold duration-500"
                onClick={item?.onClick}
              >
                {item.icon} {item.label}
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

export default SettingsComponent;
