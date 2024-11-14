import { get, post } from '../../apis';
import { ResponseAxios, ResponsePagination } from '../../types/common';
import { TypeVoteEnum } from '../../types/enum/typeVote.enum';
import { CommentType } from '../../types/PostType';

export const getCommentsByPostId = async (postId: string): Promise<ResponsePagination<CommentType[]>> => {
  const data: ResponsePagination<CommentType[]> = await get(import.meta.env.VITE_APP_API + 'comments/' + postId);
  return data as unknown as ResponsePagination<CommentType[]>;
};

export const postComment = async (
  postId: string,
  requestOption: Pick<CommentType, 'content' | 'parentComment'>
): Promise<ResponseAxios> => {
  const data = await post(import.meta.env.VITE_APP_API + 'comments/' + postId, requestOption);
  return data as unknown as ResponseAxios;
};

export const voteCommentById = async (id: string, typeVote: TypeVoteEnum): Promise<ResponsePagination<CommentType>> => {
  const data = await post(import.meta.env.VITE_APP_API + 'comments/vote/' + id, { typeVote: typeVote });
  return data as ResponsePagination<CommentType>;
};
