import { MenuOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <MenuOutlined />,
      label: 'Dashboard',
      children: [
        { key: 'default', label: 'Default' },
        { key: 'analytics', label: 'Analytics' },
        { key: 'finance', label: 'Finance' }
      ]
    },
    {
      key: 'layouts',
      icon: <SettingOutlined />,
      label: 'Layouts',
      children: [
        { key: 'vertical', label: 'Vertical' },
        { key: 'horizontal', label: 'Horizontal' },
        { key: 'compact', label: 'Compact' }
      ]
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      children: [
        { key: 'profile', label: 'Account Profile' },
        { key: 'social', label: 'Social Media' }
      ]
    }
  ];

  useEffect(() => {
    // Get the current path and set the selected keys
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);

    if (pathParts.length > 0) {
      const currentKey = pathParts[pathParts.length - 1];
      setSelectedKeys([currentKey]);

      // If the path has a parent, set it as open
      if (pathParts.length > 1) {
        setOpenKeys([pathParts[0]]);
      }
    }
  }, [location.pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(`/admin/${key}`);
  };

  return (
    <aside className="h-screen w-fit bg-gray-100 dark:bg-gray-900">
      <div className="bg-primary-500 flex h-16 items-center justify-center text-white">
        <img src="https://ableproadmin.com/tailwind/assets/images/logo-dark.svg" alt="Logo" className="h-8" />
        <span className="ml-2 text-lg font-bold">Dashboard</span>
      </div>
      <Menu
        theme="light"
        mode="inline"
        items={menuItems}
        className="h-[calc(100%-4rem)] overflow-auto !bg-red-100"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        onClick={handleMenuClick}
      />
    </aside>
  );
};

export default Sidebar;
