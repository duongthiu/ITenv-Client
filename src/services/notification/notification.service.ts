import { get } from '../../apis';
import { ResponsePagination } from '../../types/common';
import { NotificationType } from '../../types/NotificationType';

export const getNotifications = async (query: string): Promise<ResponsePagination<NotificationType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'notification/all-notification?' + query);
  return data as unknown as ResponsePagination<NotificationType[]>;
};
