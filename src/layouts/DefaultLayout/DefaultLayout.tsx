import { Layout } from 'antd';
import React, { PropsWithChildren } from 'react';
import HeaderComponent from '../../components/commons/header/header.component';
import { cn } from '../../utils/helpers/cn';

const { Content } = Layout;

interface DefaultLayoutProps {
  useHeader?: boolean;
  useSidebar?: boolean;
  useFooter?: boolean;
  fullWidth?: boolean;
}

const DefaultLayout: React.FC<PropsWithChildren<DefaultLayoutProps>> = ({
  children,
  useHeader = true,
  useFooter = true,
  fullWidth = false
}) => {
  // const { pathname } = useLocation();
  // console.log(pathname);

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
        <Content
          style={{ minHeight: 'calc(100vh - 120px)' }}
          className={cn('duration-200', !fullWidth ? 'flex max-w-[1440px]' : 'flex')}
        >
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
