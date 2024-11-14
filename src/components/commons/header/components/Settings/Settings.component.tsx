import { Avatar, Divider, List } from 'antd';

import { CiLogout } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { logout } from '../../../../../redux/user/user.slice';
import DarkMode from './DarkmodeToggle/DarkMode';
import { paths } from '../../../../../routes/paths';
// const menuItems = [
//   label: 'Profile',
// ]
type SettingMenuItemType = {
  icon: JSX.Element;
  label: string;
  onClick?: () => void;
};

const SettingsComponent = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const menuItems: SettingMenuItemType[] = [
    {
      icon: <CiLogout />,
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
                key={item.label}
                className="link-hover flex cursor-pointer items-center gap-5 rounded-lg px-2 py-3 text-[1.6rem] font-semibold duration-500"
                onClick={item?.onClick}
              >
                {item.icon} {item.label}
              </div>
            ))}
            <div className="flex items-center gap-5 px-2 py-3">
              <span className="text-[1.6rem] font-semibold">Theme</span>
              <DarkMode />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SettingsComponent;
