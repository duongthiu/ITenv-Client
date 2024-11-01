import { get, post } from '../../apis';
import { ResponseAxios, ResponsePagination } from '../../types/common';
import { UserType } from '../../types/UserType';

export const getCurrentUser = async (): Promise<UserType> => {
  const data = await get(import.meta.env.VITE_APP_API + 'user/current');
  return data as unknown as UserType;
};
export const getAllUser = async (query: string): Promise<ResponsePagination<UserType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'user/all/?' + query);
  return data as unknown as ResponsePagination<UserType[]>;
};

export const createFriendRequest = async (data: { receiver: string }): Promise<ResponseAxios> => {
  const result = await post(import.meta.env.VITE_APP_API + 'friend/create', data);
  return result as ResponseAxios;
};
