import { get } from '../../apis';
import { ResponsePagination } from '../../types/common';

export const getTotalProblems = async (): Promise<ResponsePagination<number>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problems/total/all');
  return data as unknown as ResponsePagination<number>;
};
export const getProblemEngagement = async (): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problems/engagement');
  return data as unknown as ResponsePagination<any>;
};
export const getTop10Solver = async (): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problems/solver');
  return data as unknown as ResponsePagination<any>;
};
