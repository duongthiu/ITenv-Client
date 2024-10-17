import { get } from '../../apis';
import { ResponseAxios, ResponsePagination } from '../../types/common';
import { TagType } from '../../types/TagType';

export const getTags = async (): Promise<ResponsePagination<TagType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'tag/all-tags');
  return data as unknown as ResponseAxios<TagType[]>;
};
