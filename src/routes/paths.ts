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
  detailDiscuss: '/discuss/:parentCateId/:id',
  detailDiscuss2: '/discuss/detail-discuss/:id',

  createPost: '/discuss/:parentCateId/create-post',
  messages: '/messages',
  profile: '/profile/:userId',
  me: '/profile/me',
  search: '/search'
};
