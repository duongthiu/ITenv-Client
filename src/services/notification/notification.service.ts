import { get, post } from '../../apis';
import { QueryOptions, ResponsePagination } from '../../types/common';
import { NotificationType } from '../../types/NotificationType';

export const getNotifications = async (queryOptions: QueryOptions): Promise<ResponsePagination<NotificationType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'notifications?', {
    params: queryOptions
  });
  return data as unknown as ResponsePagination<NotificationType[]>;
};

export const seenNotification = async (data: {
  notificationId: string;
}): Promise<ResponsePagination<NotificationType>> => {
  const resp = await post(import.meta.env.VITE_APP_API + 'notifications/seen', data);
  return resp as unknown as ResponsePagination<NotificationType>;
};
