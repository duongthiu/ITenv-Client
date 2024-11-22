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
export const getDailyProblemTrend = async (): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problems/chart/solved');
  return data as unknown as ResponsePagination<any>;
};

export const getTotalActiveProblems = async (): Promise<ResponsePagination<number>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problems/total/active');
  return data as unknown as ResponsePagination<number>;
};
export const getSolverProblems = async (): Promise<ResponsePagination<number>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problems/solver');
  return data as unknown as ResponsePagination<number>;
};
export const getTotalDataProblemPage = async (): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problems/data/page');
  return data as unknown as ResponsePagination<any>;
};
