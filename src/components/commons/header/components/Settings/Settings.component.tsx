import { UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, List } from 'antd';

import { CiLogout } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import DarkMode from './DarkmodeToggle/DarkMode';
// const menuItems = [
//   label: 'Profile',
// ]
type SettingMenuItemType = {
  icon: JSX.Element;
  label: string;
};

const menuItems: SettingMenuItemType[] = [
  {
    icon: <CiLogout />,
    label: 'Logout'
  },
  {
    icon: <CiLogout />,
    label: 'Logout'
  },
  {
    icon: <CiLogout />,
    label: 'Log Out'
  }
];

const SettingsComponent = () => {
  return (
    <div className="min-w-[300px]">
      <List
        className="p-1"
        children={
          <div>
            <Link
              to={'/profile/TranDuongThieu'}
              className="link-hover flex cursor-pointer items-center gap-4 rounded-lg p-2 text-current duration-500"
            >
              <Avatar size={36} icon={<UserOutlined />} />
              <div className="flex flex-col justify-center">
                <span className="text-[1.65rem] font-semibold">Tran Duong Thieu</span>
                <span className="w-full truncate text-[1.4rem] font-light">tranduongthieuhcmute@gmail.com</span>
              </div>
            </Link>
            <Divider className="my-2" />
            {menuItems.map((item) => (
              <div className="link-hover flex cursor-pointer items-center gap-5 rounded-lg px-2 py-3 text-[1.6rem] font-semibold duration-500">
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
