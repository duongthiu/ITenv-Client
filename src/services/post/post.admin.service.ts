import { get } from '../../apis';
import { QueryOptions, ResponsePagination } from '../../types/common';
import { PostType } from '../../types/PostType';

export const getTotalPosts = async (): Promise<ResponsePagination<number>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/total/all');
  return data as unknown as ResponsePagination<number>;
};
export const getPostActivityByMonth = async (queryOptions: QueryOptions): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/activity/distribute', { params: queryOptions });
  return data as unknown as ResponsePagination<any>;
};
export const getAllPosts = async (queryOptions: QueryOptions): Promise<ResponsePagination<PostType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/all', { params: queryOptions });
  return data as unknown as ResponsePagination<PostType[]>;
};
export const getDailyPostTrend = async (): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/chart/trend');
  return data as unknown as ResponsePagination<any>;
};
export const getPostOverViews = async (): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/overview');
  return data as unknown as ResponsePagination<any>;
};
export const getTotalDataPost = async (): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/data/page');
  return data as unknown as ResponsePagination<any>;
};
