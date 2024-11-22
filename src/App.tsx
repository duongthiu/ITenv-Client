import { ConfigProvider, theme as themeAntd } from 'antd';
import { useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import AuthenticationPage from './pages/Authentication/Authentication.page';
import NotAuthPage from './pages/ExceptionPage/NotAuthPage';
import NotFoundPage from './pages/ExceptionPage/NotFoundPage';
import DiscussPage from './pages/Public/Discuss/DiscussPage';
import { THEME } from './redux/app/app.slice';
import { useAppSelector } from './redux/app/hook';
import { ADMIN_ROUTES, AUTHEN_ROUTES, DISCUSS_ROUTES, PUBLIC_ROUTES, RouteType } from './routes/routes';
// import { Helmet } from 'react-helmet';
import AdminLayout from './layouts/layoutsAdmin/adminLayout';
import PostsPage from './pages/Admin/PostsPage';
import ProblemsPage from './pages/Admin/ProblemsPage';
// impoxrt { Helmet } from 'react-helmet';

// const pathname = location.path

function App() {
  const location = window.location;
  const [pathname, setPathname] = useState(location?.pathname?.split('/')[1]);
  const theme = useAppSelector((state) => state.app.theme);
  const { isLogged, token, user } = useAppSelector((state) => state.user);
  // console.log(user);
  // useEffect(() => {
  //   if (isLogged && token) {
  //     dispatch(getUser());
  //   }
  // }, [isLogged, token, dispatch]);

  useEffect(() => {
    setPathname(location?.pathname?.split('/')[1]);
  }, [location.pathname]);

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
      {/* <Helmet>
        <title>{`ITenv ${pathname && `- ${pathname}`}`}</title>
      </Helmet> */}
      {/* <div className="fixed bottom-0 right-20 z-50">
        <MessageBox />
      </div> */}
      <main className="">
        <Router>
          <Routes>
            {PUBLIC_ROUTES.map((route: RouteType, index: number) => {
              let Layout: any = DefaultLayout;
              if (route?.layout) Layout = route.layout;
              else if (route.layout === null) Layout = Fragment;
              if (route.private === 'public')
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      route.layout === null ? (
                        <Fragment key={index}> {route.element}</Fragment>
                      ) : (
                        <Layout
                          key={index}
                          useHeader={route.useHeader}
                          useSidebar={route.useSidebar}
                          useFooter={route.useFooter}
                        >
                          {route.element}
                        </Layout>
                      )
                    }
                  ></Route>
                );
              else {
                if (isLogged && token) {
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        route.layout === null ? (
                          <Fragment> {route.element}</Fragment>
                        ) : (
                          <Layout
                            key={index}
                            useHeader={route.useHeader}
                            useSidebar={route.useSidebar}
                            useFooter={route.useFooter}
                          >
                            {route.element}
                          </Layout>
                        )
                      }
                    ></Route>
                  );
                } else return <Route path="*" element={<NotAuthPage />} />;
              }
            })}

            {DISCUSS_ROUTES.map((route: RouteType) => {
              let Layout: any = DefaultLayout;
              if (route?.layout) Layout = route.layout;
              else if (route.layout === null) Layout = Fragment;
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <DiscussPage />
                    </Layout>
                  }
                >
                  <Route path={route.path} element={route.element} />
                </Route>
              );
            })}

            {AUTHEN_ROUTES.map((route: RouteType) => {
              return (
                <Route key={route.path} path={route.path} element={<AuthenticationPage />}>
                  <Route path={route.path} element={route.element} />
                </Route>
              );
            })}

            {user?.role === 'ADMIN' &&
              ADMIN_ROUTES.map((route: RouteType) => {
                let Layout: any = AdminLayout;
                if (route?.layout) Layout = route.layout;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                else if (route.layout === null) Layout = Fragment;
                return <Route key={route.path} path={route.path} element={<Layout>{route.element}</Layout>}></Route>;
              })}
            <Route path="/admin/posts" element={<AdminLayout><PostsPage /></AdminLayout>} />
            <Route path="/admin/problems" element={<AdminLayout><ProblemsPage /></AdminLayout>} />

            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </Router>
      </main>
    </ConfigProvider>
  );
}

export default App;
