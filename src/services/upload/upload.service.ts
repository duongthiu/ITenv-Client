import { post } from '../../apis';
import { ResponsePagination } from '../../types/common';
export type UploadResponseType = {
  url?: string;
  filename?: string;
};
export const uploadSingleImage = async (formData: FormData): Promise<ResponsePagination<UploadResponseType>> => {
  console.log(formData);
  const data = await post(import.meta.env.VITE_APP_API + 'storage/upload/image', {
    data: formData
  });
  return data as unknown as ResponsePagination<UploadResponseType>;
};
