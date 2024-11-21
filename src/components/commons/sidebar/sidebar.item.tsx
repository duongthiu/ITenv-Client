import { MenuProps } from 'antd';
import { FaChartBar, FaCode, FaEdit, FaUserAlt } from 'react-icons/fa';
import { HiOutlineUsers } from 'react-icons/hi2';
import { IoIosSettings } from 'react-icons/io';
import { MdShowChart } from 'react-icons/md';
import { PiCodesandboxLogo } from 'react-icons/pi';
import { TbBadge } from 'react-icons/tb';
// const items: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
//   const key = String(index + 1);
//   return {
//     key: `sub${key}`,
//     icon: React.createElement(icon),
//     label: `subnav ${key}`
//   };
// });

export const SIDEBAR_ITEMS: MenuProps['items'] = [
  {
    key: `friends`,
    icon: <HiOutlineUsers size={25} />,
    label: `Friends`
  },
  {
    key: `saved`,
    icon: <TbBadge size={25} />,
    label: `Saved`
  },
  {
    key: `sanbox`,
    icon: <PiCodesandboxLogo size={25} />,
    label: `My Sanbox`
  }
];

export const ADMIN_SIDEBAR: MenuProps['items'] = [
  {
    label: 'Overview',
    icon: <FaChartBar />,
    key: '/overviews'
  },
  { label: 'Users', icon: <FaUserAlt size={15} />, key: '/users' },
  { label: 'Posts', icon: <FaEdit size={15} />, key: '/posts' },
  { label: 'Problems', icon: <FaCode size={15} />, key: '/sales' },

  { label: 'Analytics', icon: <MdShowChart size={15} />, key: '/analytics' },
  { label: 'Settings', icon: <IoIosSettings size={15} />, key: '/settings' }
];
