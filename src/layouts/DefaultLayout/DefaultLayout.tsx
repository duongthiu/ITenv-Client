import { Layout } from 'antd';
import React, { PropsWithChildren, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FooterComponent from '../../components/commons/footer.component';
import HeaderComponent from '../../components/commons/header/header.component';
import SidebarComponent from '../../components/commons/sidebar/sidebar.component';
import { cn } from '../../utils/helpers/cn';

const { Content } = Layout;

interface DefaultLayoutProps {
  useHeader?: boolean;
  useSidebar?: boolean;
  useFooter?: boolean;
}

const DefaultLayout: React.FC<PropsWithChildren<DefaultLayoutProps>> = ({
  children,
  useHeader = true,
  useSidebar = true,
  useFooter = true
}) => {
  const { pathname } = useLocation();
  console.log(pathname);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex justify-center overflow-x-hidden">
      {useHeader && <HeaderComponent />}
      <div
        className={cn(
          useHeader && 'pt-[60px]',
          'desktop:h-screen, flex',
          useFooter ? 'pb-[80px]' : 'pb-[20px]',
          'flex h-screen w-full justify-center'
        )}
      >
        <Content style={{ minHeight: 'calc(100vh - 120px)' }} className={cn('duration-200', 'flex max-w-[1440px]')}>
          {/* {useSidebar && (
            <div
              className="p-4"
              style={{
                // zIndex: 1000,
                height: useHeader ? (useFooter ? 'calc(100vh - 140px)' : 'calc(100vh - 90px)') : 'calc(100vh - 60px)'
              }}
            >
              <SidebarComponent collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
            </div>
          )} */}
          <div className="h-full w-full"> {children}</div>
        </Content>
      </div>

      {/* {useFooter && <FooterComponent />} */}
    </div>
  );
};

export default DefaultLayout;
