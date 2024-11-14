import { get } from '../../apis';
import { CategoryType } from '../../types/CategoryType';
import { ResponsePagination } from '../../types/common';
import { ProblemType } from '../../types/ProblemType';

export const getProblems = async (query: string): Promise<ResponsePagination<ProblemType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problems/?' + query);
  return data as unknown as ResponsePagination<ProblemType[]>;
};
export const getSingleProblem = async (slug: string): Promise<ResponsePagination<ProblemType>> => {
  const data = await get<ResponsePagination<ProblemType>>(import.meta.env.VITE_APP_API + 'problems/' + slug);
  return data as unknown as ResponsePagination<ProblemType>;
};
export const getProblemCategories = async (): Promise<ResponsePagination<CategoryType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'categories/problems');
  return data as unknown as ResponsePagination<CategoryType[]>;
};
