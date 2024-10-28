import { get, post } from '../../apis';
import { CategoryType } from '../../types/CategoryType';
import { ResponseAxios, ResponsePagination } from '../../types/common';
import { TypeVoteEnum } from '../../types/enum/typeVote.enum';
import { PostType } from '../../types/PostType';

export type PostTypeRequest = {
  title: string;
  content: string;
  tags?: string[];
  isAnonymous: boolean;
  categoryId: string;
};
export const createPost = async (requestOption: PostTypeRequest): Promise<ResponsePagination<PostType>> => {
  const data = await post(import.meta.env.VITE_APP_API + 'post/create-post', requestOption);
  return data as unknown as ResponsePagination<PostType>;
};
export const deleteImages = async (requestOption: { images: string[] }): Promise<ResponseAxios> => {
  console.log(requestOption);
  const data = await post(import.meta.env.VITE_APP_API + 'storage/upload/delete-image', requestOption);
  return data;
};
export const getPostsWithCategoryId = async (
  categoryId: string,
  query: string
): Promise<ResponsePagination<PostType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'post/all-posts/' + categoryId + '/?' + query);
  return data as unknown as ResponsePagination<PostType[]>;
};
export const getPostById = async (id: string): Promise<ResponsePagination<PostType>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'post/' + id);
  return data as unknown as ResponsePagination<PostType>;
};
export const votePostById = async (id: string, typeVote: TypeVoteEnum): Promise<ResponseAxios> => {
  const data = await post(import.meta.env.VITE_APP_API + 'post/vote/' + id, { typeVote: typeVote });
  return data;
};

export const getCategory = async (): Promise<ResponsePagination<CategoryType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'category/posts/get-cates');
  return data as unknown as ResponsePagination<CategoryType[]>;
};
