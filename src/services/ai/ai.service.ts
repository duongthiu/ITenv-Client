import { post } from '../../apis';
import { ResponsePagination } from '../../types/common';

export type RefactorCodeRequest = {
  problemId: string;
  code: string;
  lang: string;
};

export type RefactorCodeResponse = {
  refactoredCode: string;
};

export const refactorCode = async (
  requestOptions: RefactorCodeRequest
): Promise<ResponsePagination<RefactorCodeResponse>> => {
  const data = await post(import.meta.env.VITE_APP_API + 'ai/refactor', requestOptions);
  return data as unknown as ResponsePagination<RefactorCodeResponse>;
};
