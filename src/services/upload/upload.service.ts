import { post } from '../../apis';
import { ResponseAxios, ResponsePagination } from '../../types/common';
export type UploadResponseType = {
  url?: string;
  filename?: string;
};
export const uploadSingleImage = async (formData: FormData): Promise<ResponsePagination<UploadResponseType>> => {
  const data = await post(import.meta.env.VITE_APP_API + 'storages', {
    data: formData
  });
  return data as unknown as ResponsePagination<UploadResponseType>;
};
export const deleteImages = async (requestOption: { images: string[] }): Promise<ResponseAxios> => {
  const data = await post(import.meta.env.VITE_APP_API + 'storages', requestOption);
  return data as ResponseAxios;
};
