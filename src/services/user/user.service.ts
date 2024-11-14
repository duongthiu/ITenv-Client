import { get, post, put } from '../../apis';
import { AccountType } from '../../types/AccountType';
import { QueryOptions, ResponseAxios, ResponsePagination } from '../../types/common';
import { FriendType } from '../../types/FriendType';
import { UserType } from '../../types/UserType';

export const getCurrentUser = async (): Promise<UserType> => {
  const data = await get(import.meta.env.VITE_APP_API + 'user/current');
  return data as unknown as UserType;
};
export const getAllUser = async (query: string): Promise<ResponsePagination<[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'user/all/users/friend-page/?' + query);
  return data as unknown as ResponsePagination<[]>;
};

export const getFriendByType = async (query: string): Promise<ResponsePagination<FriendType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'user/all/friends/?' + query);
  return data as unknown as ResponsePagination<FriendType[]>;
};
export const createFriendRequest = async (data: { receiver: string }): Promise<ResponseAxios> => {
  const result = await post(import.meta.env.VITE_APP_API + 'friend/create', data);
  return result as ResponseAxios;
};
export const acceptFriendRequest = async (data: { friendId: string }): Promise<ResponseAxios> => {
  const result = await post(import.meta.env.VITE_APP_API + 'friend/accept', data);
  return result as ResponseAxios;
};
export const rejectFriendRequest = async (data: { friendId: string }): Promise<ResponseAxios> => {
  const result = await post(import.meta.env.VITE_APP_API + 'friend/reject', data);
  return result as ResponseAxios;
};

export const getFriendsByUserId = async (userId: string): Promise<ResponsePagination<FriendType[]>> => {
  const result = await get(import.meta.env.VITE_APP_API + 'friend/' + userId);
  return result as ResponsePagination<FriendType[]>;
};
export const getUserById = async (userId: string): Promise<ResponsePagination<UserType>> => {
  const result = await get(import.meta.env.VITE_APP_API + 'user/' + userId);
  return result as ResponsePagination<UserType>;
};
export const getFriendRequests = async (queryOptions: QueryOptions): Promise<ResponsePagination<FriendType[]>> => {
  const result = await get(import.meta.env.VITE_APP_API + 'friend/request', { params: queryOptions });
  return result as ResponsePagination<FriendType[]>;
};

export const updateAvatar = async (data: FormData): Promise<ResponsePagination<{ avatar: string }>> => {
  const result = await put(import.meta.env.VITE_APP_API + 'user/edit/avatar', data);
  return result;
};
type updateProfileData = {
  username?: string;
  dob?: string;
  phoneNumber?: string;
  gender?: string;
};
export const updateProfile = async (data: updateProfileData): Promise<ResponsePagination<UserType>> => {
  console.log(data);
  const result = await put(import.meta.env.VITE_APP_API + 'user/edit/myprofile', { ...data });
  return result;
};

export const getAllAccount = async (): Promise<ResponsePagination<AccountType>> => {
  const result = await get(import.meta.env.VITE_APP_API + 'account/get-all');
  return result;
};
