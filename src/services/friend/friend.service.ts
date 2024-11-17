import { get, post } from '../../apis';
import { QueryOptions, ResponseAxios, ResponsePagination } from '../../types/common';
import { FriendType } from '../../types/FriendType';

export const createFriendRequest = async (data: { receiver: string }): Promise<ResponseAxios> => {
  const result = await post(import.meta.env.VITE_APP_API + 'friends', data);
  return result as ResponseAxios;
};
export const acceptFriendRequest = async (data: { friendId: string }): Promise<ResponseAxios> => {
  const result = await post(import.meta.env.VITE_APP_API + 'friends/accept', data);
  return result as ResponseAxios;
};
export const rejectFriendRequest = async (data: { friendId: string }): Promise<ResponseAxios> => {
  const result = await post(import.meta.env.VITE_APP_API + 'friends/reject', data);
  return result as ResponseAxios;
};

export const getFriendsByUserId = async (
  userId: string,
  queryOptions: QueryOptions
): Promise<ResponsePagination<FriendType[]>> => {
  const result = await get(import.meta.env.VITE_APP_API + 'friends/' + userId, { params: queryOptions });
  return result as ResponsePagination<FriendType[]>;
};
export const getFriendRequests = async (queryOptions: QueryOptions): Promise<ResponsePagination<FriendType[]>> => {
  const result = await get(import.meta.env.VITE_APP_API + 'friends/request', { params: queryOptions });
  return result as ResponsePagination<FriendType[]>;
};
