import { ResponseAxios } from '../types/common/response.type';
import { AxiosRequestConfig } from 'axios';
import { default as axiosInstance } from './axios';

export const post = <T, K>(
  endpoint: string,
  data: K,
  config?: AxiosRequestConfig<unknown>
): Promise<ResponseAxios<T>> => {
  return axiosInstance.post(endpoint, data, config);
};

export const put = <T, K = unknown>(endpoint: string, data: K, config?: AxiosRequestConfig<unknown>) =>
  axiosInstance.put(endpoint, data, config) as Promise<ResponseAxios<T>>;
export const remove = <T>(endpoint: string, config?: AxiosRequestConfig<unknown>) =>
  axiosInstance.delete(endpoint, config) as Promise<ResponseAxios<T>>;

export const get = <T>(endpoint: string, config?: AxiosRequestConfig<unknown>): Promise<ResponseAxios<T>> => {
  return axiosInstance.get(endpoint, config);
};