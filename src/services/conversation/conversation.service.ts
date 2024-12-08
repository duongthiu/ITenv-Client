import { get, post, put } from '../../apis';
import { QueryOptions, ResponsePagination } from '../../types/common';
import { ConversationType } from '../../types/ConversationType';

export const getConversationsByUserId = async (
  queryOptions: QueryOptions
): Promise<ResponsePagination<ConversationType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'conversations', {
    params: queryOptions
  });
  return data as unknown as ResponsePagination<ConversationType[]>;
};

export const createGroupChat = async (groupName: string, participants: string[]) => {
  const data = await post(import.meta.env.VITE_APP_API + 'conversations', { groupName, participants });
  return data as unknown as ResponsePagination<ConversationType>;
};

export const removeMember = async (conversationId: string, userId: string) => {
  const data = await post(import.meta.env.VITE_APP_API + 'conversations/remove-member/' + conversationId, { userId });
  return data as unknown as ResponsePagination<ConversationType>;
};

export const addMember = async (conversationId: string, memberIds: string[]) => {
  const data = await post(import.meta.env.VITE_APP_API + 'conversations/add-member/' + conversationId, { memberIds });
  return data as unknown as ResponsePagination<ConversationType>;
};

export const changeGroupName = async (conversationId: string, groupName: string) => {
  const data = await put(import.meta.env.VITE_APP_API + 'conversations/change-name/' + conversationId, { groupName });
  return data as unknown as ResponsePagination<ConversationType>;
  return;
};

export const changeGroupAvatar = async (
  conversationId: string,
  data: FormData
): Promise<ResponsePagination<ConversationType>> => {
  const result = await put(import.meta.env.VITE_APP_API + 'conversations/change-photo/' + conversationId, data);
  return result as ResponsePagination<ConversationType>;
};

export const leaveGroupChat = async (conversationId: string): Promise<ResponsePagination<ConversationType>> => {
  const result = await put(import.meta.env.VITE_APP_API + 'conversations/leave/' + conversationId, {});
  return result as ResponsePagination<ConversationType>;
};
export const setMemberAsAdmin = async (
  conversationId: string,
  memberId: string
): Promise<ResponsePagination<ConversationType>> => {
  const result = await put(import.meta.env.VITE_APP_API + 'conversations/set-admin/' + conversationId, {
    userId: memberId
  });
  return result as ResponsePagination<ConversationType>;
};
