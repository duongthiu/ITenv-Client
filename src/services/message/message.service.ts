import { get, post } from '../../apis';
import { QueryOptions, ResponsePagination } from '../../types/common';
import { MessageType } from '../../types/ConversationType';

export const getMessageByConversationId = async (
  conversationId: string,
  queryOptions: QueryOptions
): Promise<ResponsePagination<MessageType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'messages/' + conversationId, {
    params: queryOptions
  });
  return data as unknown as ResponsePagination<MessageType[]>;
};

export const sendMessage = async (data: FormData): Promise<ResponsePagination<MessageType>> => {
  const result = await post(import.meta.env.VITE_APP_API + 'messages', data);
  return result as ResponsePagination<MessageType>;
};

export const recallMessage = async (messageId: string): Promise<ResponsePagination<MessageType>> => { 
  const result = await post(import.meta.env.VITE_APP_API + 'messages/recall/' + messageId, {});
  return result as ResponsePagination<MessageType>;
}