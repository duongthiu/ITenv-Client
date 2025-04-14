// AdminLayout.tsx (Tạo một layout dành riêng cho Admin)

import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import Sidebar from '../../components/CommonAdmin/Sidebar';
import { cn } from '../../utils/helpers/cn';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className="flex justify-center overflow-x-hidden">
      {/* <HeaderComponent /> */}
      <div className={cn('desktop:h-screen, flex', 'flex h-screen w-full justify-center')}>
        <Content style={{ minHeight: 'calc(100vh - 120px)' }} className={cn('duration-200', 'flex')}>
          <div
            style={{
              // zIndex: 1000,
              height: 'calc(100vh - 60px)'
            }}
          >
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          </div>

          <div className={cn('w-full duration-200', !collapsed ? 'ml-[220px]' : 'ml-[80px]')}>
            <div className="pl-6"> {children}</div>
          </div>
        </Content>
      </div>

      {/* {useFooter && <FooterComponent />} */}
    </div>
  );
};

export default AdminLayout;
