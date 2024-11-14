import { get } from '../../apis';
import { QueryOptions, ResponsePagination } from '../../types/common';
import { ConversationType } from '../../types/ConversationType';

export const getConversationsByUserId = async (
  queryOptions: QueryOptions
): Promise<ResponsePagination<ConversationType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'conversations?', {
    params: queryOptions
  });
  return data as unknown as ResponsePagination<ConversationType[]>;
};
