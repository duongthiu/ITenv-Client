import { get, post } from '../../apis';
import { ResponsePagination } from '../../types/common';
import { CommentType } from '../../types/PostType';

export const getCommentsByPostId = async (postId: string): Promise<ResponsePagination<CommentType[]>> => {
  const data: ResponsePagination<CommentType[]> = await get(import.meta.env.VITE_APP_API + 'comment/' + postId);
  return data;
};

export const postComment = async (
  postId: string,
  requestOption: Pick<CommentType, 'content' | 'parentComment'>
): Promise<ResponsePagination<CommentType>> => {
  const data = await post(import.meta.env.VITE_APP_API + 'comment/' + postId, requestOption);
  return data;
};
