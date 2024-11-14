import { get, put } from '../../apis';
import { ResponsePagination } from '../../types/common';
import { UserType } from '../../types/UserType';

export const getCurrentUser = async (): Promise<UserType> => {
  const data = await get(import.meta.env.VITE_APP_API + 'users/current');
  return data as unknown as UserType;
};
export const getAllUser = async (query: string): Promise<ResponsePagination<[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'users/friend-page/?' + query);
  return data as unknown as ResponsePagination<[]>;
};

// export const getFriendByType = async (query: string): Promise<ResponsePagination<FriendType[]>> => {
//   const data = await get(import.meta.env.VITE_APP_API + 'user/all/friends/?' + query);
//   return data as unknown as ResponsePagination<FriendType[]>;
// };

export const getUserById = async (userId: string): Promise<ResponsePagination<UserType>> => {
  const result = await get(import.meta.env.VITE_APP_API + 'users/' + userId);
  return result as ResponsePagination<UserType>;
};

export const updateAvatar = async (data: FormData): Promise<ResponsePagination<{ avatar: string }>> => {
  const result = await put(import.meta.env.VITE_APP_API + 'users/avatar', data);
  return result as ResponsePagination<{ avatar: string }>;
};
type updateProfileData = {
  username?: string;
  dob?: string;
  phoneNumber?: string;
  gender?: string;
};
export const updateProfile = async (data: updateProfileData): Promise<ResponsePagination<UserType>> => {
  const result = await put(import.meta.env.VITE_APP_API + 'users', { ...data });
  return result as ResponsePagination<UserType>;
};
