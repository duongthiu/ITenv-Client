import { get, post } from '../../apis';
import { CategoryType } from '../../types/CategoryType';
import { ResponsePagination } from '../../types/common';
import { ProblemType, SubmissionDetailType, SubmissionStatusType } from '../../types/ProblemType';

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
export type submitCodeQueryOptions = {
  lang: string;
  question_id: string;
  typed_code: string;
};
export const submitCode = async (
  slug: string,
  requestOptions: submitCodeQueryOptions
): Promise<ResponsePagination<SubmissionStatusType>> => {
  const data = await post('http://localhost:4000/api/' + `problems/${slug}/submit`, requestOptions);
  return data as unknown as ResponsePagination<SubmissionStatusType>;
};

export const getSubmissionDetail = async (submissionId: string): Promise<ResponsePagination<SubmissionDetailType>> => {
  const data = await get(`http://localhost:4000/api/problems/submission/${submissionId}`);
  return data as unknown as ResponsePagination<SubmissionDetailType>;
};

export const getAverageProblemsPerUser = async (): Promise<ResponsePagination<null>> => {
  const total = await get(import.meta.env.VITE_APP_API + 'problems/average/per-user');
  return total as ResponsePagination<null>;
};