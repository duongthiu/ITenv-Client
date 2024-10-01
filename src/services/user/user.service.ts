import { get } from '../../apis';

export const getCurrentUser = async () => {
  const { data } = await get(import.meta.env.VITE_APP_API + 'user/current');
  return data;
};
