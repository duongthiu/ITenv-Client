import { get, put } from '../../apis';
import { QueryOptions, ResponsePagination } from '../../types/common';
import { UserType } from '../../types/UserType';

export type UserPageType = {
  _id: string;
  email: string;
  user: UserType;
  authenWith: number[]; // Tuple type for exactly three numbers
};
export const getAllUser = async (queryOptions: QueryOptions): Promise<ResponsePagination<UserPageType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'accounts/users', { params: queryOptions });
  return data as unknown as ResponsePagination<UserPageType[]>;
};

export const getTotalUsers = async (): Promise<ResponsePagination<number>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'users/total');
  return data as unknown as ResponsePagination<number>;
};
export const getTotalActiveUsers = async (): Promise<ResponsePagination<number>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'users/total/active');
  return data as unknown as ResponsePagination<number>;
};
export const getTotalNewUsers = async (): Promise<ResponsePagination<number>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'users/new/today');
  return data as unknown as ResponsePagination<number>;
};
export const getTotalChurnUsers = async (): Promise<ResponsePagination<number>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'users/percent/churn-rate');
  return data as unknown as ResponsePagination<number>;
};

export const getUserGrowth = async (): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'users/growth');
  return data as unknown as ResponsePagination<any>;
};
export const getUserDemographics = async (): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'users/demographics');
  return data as unknown as ResponsePagination<any>;
};
export const getTotalNewUsersInMonths = async (): Promise<ResponsePagination<number>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'users/new/month');
  return data as unknown as ResponsePagination<number>;
};
export const editUserRole = async (userId: string, role: string): Promise<ResponsePagination<any>> => {
  const data = await put(import.meta.env.VITE_APP_API + `accounts/${userId}/role`, { role: role });
  return data as unknown as ResponsePagination<any>;
};
