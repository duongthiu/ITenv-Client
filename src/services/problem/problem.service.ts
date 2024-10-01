import { get } from '../../apis';
import { ResponsePagination } from '../../types/common';
import { ProblemType } from '../../types/ProblemType';

export const getProblems = async (query: string): Promise<ResponsePagination<ProblemType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problem/?' + query);
  return data as unknown as ResponsePagination<ProblemType[]>;
};
export const getSingleProblem = async (slug: string): Promise<ResponsePagination<ProblemType>> => {
  const data: ResponsePagination<ProblemType> = await get<ResponsePagination<ProblemType>>(
    import.meta.env.VITE_APP_API + 'problem/' + slug
  );
  return data;
};
