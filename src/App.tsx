import { ConfigProvider, theme as themeAntd } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import NotFoundPage from './pages/ExceptionPage/NotFoundPage';
import { AUTHEN_ROUTES, PUBLIC_ROUTES, RouteType } from './routes/routes';
import AuthenticationPage from './pages/Authentication/Authentication.page';
import { useAppSelector } from './redux/app/hook';
import { THEME } from './redux/app/app.slice';

// import { Helmet } from 'react-helmet';

// const pathname = location.path

function App() {
  const location = window.location;
  const [pathname, setPathname] = useState(location?.pathname?.split('/')[1]);
  const theme = useAppSelector((state) => state.app.theme);
  useEffect(() => {
    setPathname(location?.pathname?.split('/')[1]);
  }, [location.pathname]);
  console.log(theme);
  useEffect(() => {
    const bodyClass = theme === THEME.DARK ? 'dark-mode' : 'light-mode';
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(bodyClass);
  }, [theme]);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#21a1d3',
          fontFamily: 'Inter, sans-serif',
          colorBgBase: theme === THEME.DARK ? 'rgb(26, 27, 28)' : '#ffffff', // Background color
          colorTextBase: theme === THEME.DARK ? '#ffffff' : '#000000', // Text color
          colorBgContainer: theme === THEME.DARK ? 'rgb(40, 40, 40)' : '#ffffff', // Card background
          colorBorder: theme === THEME.DARK ? 'rgb(48, 48, 48)' : '#d9d9d9' // Border color,
        },

        algorithm: theme === THEME.DARK ? themeAntd.darkAlgorithm : themeAntd.defaultAlgorithm
      }}
    >
      <Helmet>
        <title>{`ITenv ${pathname && `- ${pathname}`}`}</title>
      </Helmet>

      <main className="">
        <Router>
          <Routes>
            {/* {PUBLIC_ROUTES.map((route: InfoPage, index: number) => {
              let Layout: any = DefaultLayout;
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }
             ) }} */}
            {PUBLIC_ROUTES.map((route: RouteType, index: number) => {
              let Layout: any = DefaultLayout;
              if (route?.layout) Layout = route.layout;
              else if (route.layout === null) Layout = Fragment;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout useHeader={route.useHeader} useSidebar={route.useSidebar} useFooter={route.useFooter}>
                      {route.element}
                    </Layout>
                  }
                ></Route>
              );
            })}
            {AUTHEN_ROUTES.map((route: RouteType, index: number) => {
              return (
                <Route key={index} path={route.path} element={<AuthenticationPage />}>
                  <Route path={route.path} element={route.element} />
                </Route>
              );
            })}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </main>
    </ConfigProvider>
  );
}

export default App;
