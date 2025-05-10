import { Button, Divider, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ADMIN_SIDEBAR } from '../commons/sidebar/sidebar.item';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { cn } from '../../utils/helpers/cn';
import '../../components/commons/sidebar/sidebar.style.scss';
import logo from '../../assets/logo/logo.png';
import { paths } from '../../routes/paths';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/user/user.slice';
import { MdLogout } from 'react-icons/md';

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPath = location.pathname;

  const handleLogout = () => {
    dispatch(logout());
    navigate(paths.login); // Redirect to login page after logout
  };

  return (
    <div
      className={cn(
        'card sidebar-wrapper z-100 fixed left-0 flex h-full flex-none flex-col p-0',
        !collapsed ? 'w-[220px]' : 'w-[80px]'
      )}
    >
      {/* Logo Section */}
      <a href={paths.adminOverviews} className="flex flex-col items-center justify-center gap-5 p-5 py-10">
        <img src={logo} alt="Logo" className="aspect-square max-h-[40px] max-w-[40px]" />
        {!collapsed && <Typography className="font-mono text-xl font-bold">ITENV</Typography>}
      </a>

      {/* Menu Section */}
      <div className="flex h-full w-full flex-col overflow-auto overflow-x-hidden">
        <Menu
          mode="inline"
          selectedKeys={[currentPath]}
          style={{ height: '100%', border: 'none', width: '100%' }}
          items={ADMIN_SIDEBAR}
          inlineCollapsed={collapsed}
          className="card p-0"
          onClick={({ key }) => navigate(key)}
        />
      </div>

      {/* Logout Button */}
      <div className="card flex items-center justify-center border-none p-4 shadow-none">
        <Button
          size="large"
          type="text"
          icon={<MdLogout size={20} />}
          className="flex w-full items-center justify-center gap-2 py-4 font-semibold text-red-600"
          onClick={handleLogout}
        >
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>

      <Divider className="w-[90%]" />

      {/* Collapse/Expand Button */}
      <Typography
        onClick={() => setCollapsed(!collapsed)}
        className="flex min-h-[60px] w-full cursor-pointer items-center justify-center rounded-none border-none px-8 pt-2"
      >
        <div className={`${collapsed && 'hidden'}`}>
          <IoIosArrowBack size={25} />
        </div>
        <div className={`${!collapsed && 'hidden'}`}>
          <IoIosArrowForward size={25} />
        </div>
      </Typography>
    </div>
  );
};

export default Sidebar;
