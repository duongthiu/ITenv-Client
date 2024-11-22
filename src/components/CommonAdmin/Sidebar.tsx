import { Divider, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { ADMIN_SIDEBAR } from '../commons/sidebar/sidebar.item';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { cn } from '../../utils/helpers/cn';
import '../../components/commons/sidebar/sidebar.style.scss';
import logo from '../../assets/logo/logo.png';

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation(); // Get current location

  // Get the current pathname to set as the selected key
  const currentPath = location.pathname;
  console.log(currentPath);
  return (
    <div
      className={cn(
        'sidebar-wrapper z-100 fixed left-0 flex h-full flex-none flex-col rounded-2xl rounded-none shadow-xl duration-200',
        !collapsed ? 'w-[220px]' : 'w-[80px]'
      )}
    >
      <div className="box flex flex-col items-center justify-center gap-5 p-5 py-10">
        <img src={logo} alt="Logo" className="h-[40px] w-[40px]" />
        {!collapsed && <Typography className="font-mono text-[2rem] font-bold">ITENV</Typography>}
      </div>
      <div className="h-full w-full overflow-auto overflow-x-hidden">
        <Menu
          mode="inline"
          selectedKeys={[currentPath]} // Set selected key based on the current URL
          style={{ height: '100%', border: 'none', width: '100%' }}
          items={ADMIN_SIDEBAR}
          inlineCollapsed={collapsed}
          onClick={({ key }) => navigate(key)} // Handle navigation on item click
        />
      </div>
      <Divider className="w-[90%]" />
      <Typography
        onClick={() => setCollapsed(!collapsed)}
        className="card flex h-[60px] min-h-[60px] w-full cursor-pointer items-center justify-center rounded-none border-none px-8"
      >
        <div className={`${collapsed && 'hidden'} `}>
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
