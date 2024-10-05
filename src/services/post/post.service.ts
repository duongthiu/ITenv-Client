import { post } from '../../apis';
import { PostType } from '../../types/PostType';

export type PostTypeRequest = {
  title: string;
  content: string;
  isAnonymous: boolean;
};
export const createPost = async (requestOption: PostTypeRequest): Promise<PostType> => {
  const data = await post(import.meta.env.VITE_APP_API + 'post', requestOption);
  return data as unknown as PostType;
};
