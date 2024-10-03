import { get } from '../../apis';
import { ResponsePagination } from '../../types/common';
import { UserType } from '../../types/UserType';

export const getCurrentUser = async (): Promise<UserType> => {
  const data = await get(import.meta.env.VITE_APP_API + 'user/current');
  return data as unknown as UserType;
};
export const getAllUser = async (query: string): Promise<ResponsePagination<UserType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'user/all/?' + query);
  return data as unknown as ResponsePagination<UserType[]>;
};
