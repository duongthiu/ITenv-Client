import { get, post } from '../../apis';
import { ResponsePagination } from '../../types/common';
import { NotificationType } from '../../types/NotificationType';

export const getNotifications = async (query: string): Promise<ResponsePagination<NotificationType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'notification/all-notification?' + query);
  return data as unknown as ResponsePagination<NotificationType[]>;
};

export const seenNotification = async (data: {
  notificationId: string;
}): Promise<ResponsePagination<NotificationType>> => {
  const resp = await post(import.meta.env.VITE_APP_API + 'notification/seen-notification', data);
  return resp as unknown as ResponsePagination<NotificationType>;
};
