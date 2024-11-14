import { get } from '../../apis';
import { ResponsePagination } from '../../types/common';
import { TagType } from '../../types/TagType';

export const getTags = async (): Promise<ResponsePagination<TagType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'tags');
  return data as unknown as ResponsePagination<TagType[]>;
};
