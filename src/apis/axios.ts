import axios, { InternalAxiosRequestConfig } from 'axios';
import { refreshAccessToken } from '../services/authentication.service';
import { STORAGE_TOKEN_KEY_NAME, TOKEN_TYPE } from '../utils/constants/auth.config';
import notify, { notifyError, notifySuccess } from '../utils/helpers/notify';
interface IWindow extends Window {
  _env_?: {
    VITE_APP_HOST: string;
    VITE_APP_HOST_SOCKET: string;
  };
}

export const ENTRY_POINT = (window as IWindow)._env_?.VITE_APP_HOST;
axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: ENTRY_POINT
});

export const SOCKET_ENTRY_POINT = (window as IWindow)._env_?.VITE_APP_HOST_SOCKET;
axiosInstance.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY_NAME) ? localStorage.getItem(STORAGE_TOKEN_KEY_NAME) : '';
  config.headers.Authorization = `${TOKEN_TYPE} ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error: { response: { status: number } }) => {
    const persistKey = 'persist:user';
    const persistedState = localStorage.getItem(persistKey);
    const parsedState = JSON.parse(persistedState!);
    if (!error.response) {
      parsedState.isLogged = false;
      localStorage.setItem(persistKey, JSON.stringify(parsedState));
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      parsedState.isLogged = false;

      notify(
        'warning',
        'Thông báo đăng nhập',
        "Phiên đăng nhập đã hết hạn! Click 'Đồng ý' để tiếp tục...",
        'bottomRight',
        async () => {
          try {
            const response = await refreshAccessToken();
            if (response?.success) {
              localStorage.setItem('accessToken', response.data!);
              parsedState.isLogged = true;
              notifySuccess('Đã refresh phiên đăng nhập thành công! Trang web sẽ tự động reload sau 5s.');
              setTimeout(() => {
                window.location.reload();
              }, 5000);
            } else {
              notifyError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            notifyError(error?.response?.data?.message || 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
          } finally {
            localStorage.setItem(persistKey, JSON.stringify(parsedState));
          }
        }
      );
      // window.location.reload();
      return new Promise((reject) => {
        reject(error);
      });
    } else {
      console.log(error);

      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
