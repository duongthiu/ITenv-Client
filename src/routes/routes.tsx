/* eslint-disable react-refresh/only-export-components */
import LazyLoadComponent from '../components/commons/LazyComponent';
import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout';
import AdminLayout from '../layouts/layoutsAdmin/adminLayout';
import DiscussByCate from '../pages/Public/Discuss/DiscussByCate/DiscussByCate.page';
import { paths } from './paths';
export type RouteType = {
  element: React.ReactNode;
  layout?: any;
  useHeader?: boolean;
  useSidebar?: boolean;
  useFooter?: boolean;
  path: string;
  private?: 'public' | 'auth' | 'admin';
  children?: RouteType[];
};
const LazyHomePage = LazyLoadComponent(() => import('../pages/Public/Home/HomePage'))(true);

const LazyEditorPage = LazyLoadComponent(() => import('../pages/Public/CodeEdittorPage.tsx/EditorPage'))(true);
const LazyLoginPage = LazyLoadComponent(() => import('../pages/Authentication/LoginForm'))(true);
const LazySignupPage = LazyLoadComponent(() => import('../pages/Authentication/SignupForm'))(true);
const LazyForgetPasswordPage = LazyLoadComponent(() => import('../pages/Authentication/ForgetPasswordForm'))(true);
const LazyDiscussPage = LazyLoadComponent(() => import('../pages/Public/Discuss/DiscussPage'))(true);
const LazyDetailDiscussPage = LazyLoadComponent(
  () => import('../pages/Public/Discuss/DetailDiscussPage/DetailDiscussPage')
)(true);
const LazyAuthenPage = LazyLoadComponent(() => import('../pages/Authentication/Authentication.page'))(true);
const LazyCreatePostPage = LazyLoadComponent(() => import('../pages/Private/CreatePostPage/CreatePostPage.page'))(true);
const LazyMessagesPage = LazyLoadComponent(() => import('../pages/Private/MessagePage/MessagePage.page'))(true);
const LazyProfilePage = LazyLoadComponent(() => import('../pages/Private/ProfilePage/ProfilePage.page'))(true);
const LazyProblemListPage = LazyLoadComponent(() => import('../pages/Public/ProblemPage/ProblemListPage'))(true);
const LazySearchPage = LazyLoadComponent(() => import('../pages/Public/SearchPage/SearchPage'))(true);
const LazyEditProfile = LazyLoadComponent(() => import('../pages/Private/EditProfilePage/EditProfilePage.page'))(true);

const LazyDashboardPage = LazyLoadComponent(() => import('../pages/Admin/Dashboard/Dashboard.page'))(true);

//admin Route
const LazyOverviewPage = LazyLoadComponent(() => import('../pages/Admin/OverviewPage'))(true);
const LazyUsersPage = LazyLoadComponent(() => import('../pages/Admin/UsersPage'))(true);
const LazySettingsPage = LazyLoadComponent(() => import('../pages/Admin/SettingsPage'))(true);
const LazyPostsPage = LazyLoadComponent(() => import('../pages/Admin/PostsPage'))(true);
const LazyProblemsPage = LazyLoadComponent(() => import('../pages/Admin/ProblemsPage'))(true);

export const PUBLIC_ROUTES: RouteType[] = [
  {
    path: paths.singleProblem,
    element: <LazyEditorPage />,
    layout: null,
    private: 'public'
  },
  {
    path: paths.home,
    element: <LazyHomePage />,
    layout: null,
    private: 'public'
    // useHeader: true,
    // useSidebar: true,
    // useFooter: false
  },
  {
    path: paths.discuss,
    element: <LazyDiscussPage />,
    layout: DefaultLayout,
    private: 'public',
    useHeader: true,
    useSidebar: false,
    useFooter: false
  },
  {
    path: paths.detailDiscuss2,
    element: <LazyDetailDiscussPage />,
    layout: DefaultLayout,
    private: 'public',
    useHeader: true,
    useSidebar: false,
    useFooter: false
  },

  {
    path: paths.detailDiscuss,
    element: <LazyDetailDiscussPage />,
    layout: DefaultLayout,
    private: 'public',
    useHeader: true,
    useSidebar: false,
    useFooter: false
  },
  {
    path: paths.createPost,
    element: <LazyCreatePostPage />,
    layout: DefaultLayout,
    private: 'auth',
    useHeader: true,
    useSidebar: true,
    useFooter: false
  },
  {
    path: paths.messages,
    element: <LazyMessagesPage />,
    layout: DefaultLayout,
    private: 'auth',
    useHeader: true,
    useSidebar: false,
    useFooter: false
  },
  {
    path: paths.messageWithoutId,
    element: <LazyMessagesPage />,
    layout: DefaultLayout,
    private: 'auth',
    useHeader: true,
    useSidebar: false,
    useFooter: false
  },
  {
    path: paths.profile,
    element: <LazyProfilePage />,
    layout: DefaultLayout,
    private: 'public',
    useHeader: true,
    useSidebar: false,
    useFooter: false
  },
  {
    path: paths.editProfile,
    element: <LazyEditProfile />,
    layout: null,
    private: 'auth'
  },
  {
    path: paths.editProfileWithoutTab,
    element: <LazyEditProfile />,
    layout: null,
    private: 'auth'
  },
  {
    path: paths.problems,
    element: <LazyProblemListPage />,
    layout: DefaultLayout,
    private: 'public',
    useHeader: true,
    useSidebar: true,
    useFooter: false
  },
  {
    path: paths.search,
    element: <LazySearchPage />,
    layout: DefaultLayout,
    private: 'public',
    useHeader: true,
    useSidebar: true,
    useFooter: false
  }
];
export const DISCUSS_ROUTES: RouteType[] = [
  {
    path: paths.parentCateDisCuss,
    element: <DiscussByCate />,
    layout: DefaultLayout,
    private: 'public',
    useHeader: true,
    useSidebar: false,
    useFooter: false
  }
];
export const AUTHEN_ROUTES: RouteType[] = [
  {
    path: paths.authentication,
    element: <LazyAuthenPage />,
    layout: null,
    private: 'public',
    useHeader: false,
    useSidebar: false,
    useFooter: false
  },
  {
    path: paths.login,
    element: <LazyLoginPage />,
    layout: null,
    private: 'public'
    // useHeader: false,
    // useSidebar: false,
    // useFooter: false
  },
  {
    path: paths.signup,
    element: <LazySignupPage />,
    layout: null,
    private: 'public'
    // useHeader: false,
    // useSidebar: false,
    // useFooter: false
  },
  {
    path: paths.forgetPassword,
    element: <LazyForgetPasswordPage />,
    layout: null,
    private: 'public'
    // useHeader: false,
    // useSidebar: false,
    // useFooter: false
  }
];

export const ADMIN_ROUTES: RouteType[] = [
  {
    path: paths.adminDashboard,
    layout: AdminLayout,
    element: <LazyDashboardPage />
  },
  {
    path: paths.adminOverviews,
    layout: AdminLayout,
    element: <LazyOverviewPage />
  },
  { path: paths.adminUsers, layout: AdminLayout, element: <LazyUsersPage /> },
  { path: paths.adminSettings, layout: AdminLayout, element: <LazySettingsPage /> },
  { path: paths.adminPosts, layout: AdminLayout, element: <LazyPostsPage /> },
  { path: paths.adminProblems, layout: AdminLayout, element: <LazyProblemsPage /> }
];
