export const paths = {
  home: '/',
  editor: '/code-editor',
  login: '/login',
  signup: '/signup',
  inforSignup: '/infor-signup',
  forgetPassword: '/forget-password',
  authentication: '/authentication',
  personal: '/personal',
  problems: '/problems',
  singleProblem: '/problems/:slug',

  discuss: '/discuss',
  parentCateDisCuss: '/discuss/:parentCateId',
  childCateDisCuss: '/discuss/:parentCateId/:childCateId',
  detailDiscuss2: '/discuss/detail-discuss/:id',
  detailDiscuss: '/discuss/:parentCateId/:id',

  createPost: '/discuss/:parentCateId/create-post',
  messages: '/messages/:id',
  messageWithoutId: '/messages/',
  profile: '/profile/:userId',
  me: '/profile/me',
  search: '/search',
  editProfile: '/edit-profile/:tab',
  editProfileWithoutTab: '/edit-profile/',

  // admin
  adminDashboard: '/admin/dashboard',
  adminOverviews: '/admin/overviews',
  adminPosts: '/admin/posts',
  adminUsers: '/admin/users',
  adminSettings: '/admin/edit-profile/:tab',
  adminProblems: '/admin/problems',
  adminAnalistics: '/admin/analytics'
};
