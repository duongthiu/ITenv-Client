import { get, post } from '../../apis';
import { QueryOptions, ResponsePagination } from '../../types/common';
import { NotificationType } from '../../types/NotificationType';

export const getNotifications = async (queryOptions: QueryOptions): Promise<ResponsePagination<NotificationType[]>> => {
  console.log('query', queryOptions);
  const data = await get(import.meta.env.VITE_APP_API + 'notification/all-notification?', {
    params: queryOptions
  });
  return data as unknown as ResponsePagination<NotificationType[]>;
};

export const seenNotification = async (data: {
  notificationId: string;
}): Promise<ResponsePagination<NotificationType>> => {
  const resp = await post(import.meta.env.VITE_APP_API + 'notification/seen-notification', data);
  return resp as unknown as ResponsePagination<NotificationType>;
};
