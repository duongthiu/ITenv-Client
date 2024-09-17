import { Divider, Menu, Typography } from 'antd';

import SIDEBAR_ITEMS from './sidebar.item';
import './sidebar.style.scss';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { cn } from '../../../utils/helpers/cn';

type SidebarProps = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};
const SidebarComponent: React.FC<SidebarProps> = ({ collapsed, toggleCollapsed }) => {
  return (
    <div
      className={cn(
        'sidebar-wrapper m-5 mb-0 mr-0 flex flex-col rounded-2xl shadow-xl duration-200',
        !collapsed ? 'w-[220px]' : 'w-[80px]'
      )}
    >
      <div className="h-full w-full overflow-auto">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', border: 'none' }}
          items={SIDEBAR_ITEMS}
          inlineCollapsed={collapsed}
        />
      </div>
      <Divider className="w-[90%]" />
      <Typography
        onClick={toggleCollapsed}
        className="card flex h-[60px] min-h-[60px] w-full cursor-pointer items-center justify-center rounded-none border-none px-8 duration-200"
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

export default SidebarComponent;
