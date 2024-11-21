import { get } from '../../apis';
import { QueryOptions, ResponsePagination } from '../../types/common';

export const getTotalPosts = async (): Promise<ResponsePagination<number>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/total/all');
  return data as unknown as ResponsePagination<number>;
};
export const getPostActivityByMonth = async (queryOptions: QueryOptions): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/activity/distribute', { params: queryOptions });
  return data as unknown as ResponsePagination<any>;
};
