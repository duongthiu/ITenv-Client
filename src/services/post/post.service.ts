import { get, post, remove } from '../../apis';
import { CategoryType } from '../../types/CategoryType';
import { QueryOptions, ResponseAxios, ResponsePagination } from '../../types/common';
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
  const data = await post(import.meta.env.VITE_APP_API + 'posts', requestOption);
  return data as unknown as ResponsePagination<PostType>;
};

export const getPostsWithCategoryId = async (
  categoryId: string,
  queryOption: QueryOptions
): Promise<ResponsePagination<PostType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/category/' + categoryId, { params: queryOption });
  return data as unknown as ResponsePagination<PostType[]>;
};

export const getPostById = async (id: string): Promise<ResponsePagination<PostType>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/' + id);
  return data as unknown as ResponsePagination<PostType>;
};
export const votePostById = async (id: string, typeVote: TypeVoteEnum): Promise<ResponseAxios> => {
  const data = await post(import.meta.env.VITE_APP_API + 'posts/vote/' + id, { typeVote: typeVote });
  return data as ResponseAxios;
};

export const getPostByUserId = async (
  userId: string,
  queryOptions: QueryOptions
): Promise<ResponsePagination<PostType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/user/' + userId, { params: queryOptions });
  return data as unknown as ResponsePagination<PostType[]>;
};

export const getCategory = async (): Promise<ResponsePagination<CategoryType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'categories/posts');
  return data as unknown as ResponsePagination<CategoryType[]>;
};

export const resolvePost = async (id: string): Promise<ResponseAxios> => {
  const data = await post(import.meta.env.VITE_APP_API + 'posts/resolve/' + id, {});
  return data as ResponseAxios;
};

export const getPostActivityDistribution = async (query: string): Promise<ResponsePagination<null>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'activity/distribute?' + query);
  return data as unknown as ResponsePagination<null>;
};

// export const voteService = async (id: string, typeVote: TypeVoteEnum): Promise<ResponseAxios> => {
//   const data = await post(import.meta.env.VITE_APP_API + 'posts/vote/' + id, { typeVote: typeVote });
//   return data as ResponseAxios;
// };
export const deletePostById = (id: string): Promise<ResponseAxios> => {
  const data = remove(import.meta.env.VITE_APP_API + 'posts/' + id);
  return data as Promise<ResponseAxios>;
};

export const getPostActivities = async (
  userId: string,
  queryOptions: QueryOptions
): Promise<ResponsePagination<PostType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'posts/post-activities/' + userId, {
    params: queryOptions
  });
  return data as unknown as ResponsePagination<PostType[]>;
};
