import { Layout } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
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
          'h-screen w-full desktop:max-w-[1464px]'
        )}
      >
        {useSidebar && (
          <div
            className="fixed left-4 top-[70px]"
            style={{
              zIndex: 1000,
              height: useHeader ? (useFooter ? 'calc(100vh - 140px)' : 'calc(100vh - 90px)') : 'calc(100vh - 60px)'
            }}
          >
            <SidebarComponent collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
          </div>
        )}
        <Content
          style={{ minHeight: 'calc(100vh - 120px)', marginLeft: useSidebar ? (collapsed ? 90 : 230) : 0 }}
          className="overflow-y-auto overflow-x-hidden duration-200"
        >
          <AnimatePresence mode="wait">
            <motion.div
              className="h-full"
              key={pathname}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Content>
      </div>

      {useFooter && <FooterComponent />}
    </div>
  );
};

export default DefaultLayout;
