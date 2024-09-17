import { MenuProps } from 'antd';
import { HiOutlineUsers } from 'react-icons/hi2';
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

const SIDEBAR_ITEMS: MenuProps['items'] = [
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
export default SIDEBAR_ITEMS;
