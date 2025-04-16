import { MenuProps } from 'antd';
import { Users, Bookmark, Box, BarChart2, User, Edit, Code, Settings } from 'lucide-react';
import { paths } from '../../../routes/paths';
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
    icon: <Users size={25} />,
    label: `Friends`
  },
  {
    key: `saved`,
    icon: <Bookmark size={25} />,
    label: `Saved`
  },
  {
    key: `sanbox`,
    icon: <Box size={25} />,
    label: `My Sanbox`
  }
];

export const ADMIN_SIDEBAR: MenuProps['items'] = [
  {
    label: 'Overview',
    icon: <BarChart2 size={20} />,
    key: paths.adminOverviews
  },
  {
    label: 'Users',
    icon: <User size={20} />,
    key: paths.adminUsers
  },
  {
    label: 'Posts',
    icon: <Edit size={20} />,
    key: paths.adminPosts
  },
  {
    label: 'Problems',
    icon: <Code size={20} />,
    key: paths.adminProblems
  },
  {
    label: 'Settings',
    icon: <Settings size={20} />,
    key: paths.adminSettings
  }
];
