import { get, post } from '../../apis';
import { CategoryType } from '../../types/CategoryType';
import { QueryOptions, ResponsePagination } from '../../types/common';
import { PostType } from '../../types/PostType';
import { ProblemType, RunCodeResultType, SubmissionDetailType, SubmissionStatusType } from '../../types/ProblemType';

export const getProblems = async (queryOptions: QueryOptions): Promise<ResponsePagination<ProblemType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problems', { params: queryOptions });
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

export const runCode = async (
  slug: string,
  requestOptions: submitCodeQueryOptions & { data_input: string }
): Promise<ResponsePagination<RunCodeResultType>> => {
  const data = await post(import.meta.env.VITE_APP_API + `problems/${slug}/run`, requestOptions);
  return data as unknown as ResponsePagination<RunCodeResultType>;
};

export const submitCode = async (
  slug: string,
  requestOptions: submitCodeQueryOptions
): Promise<ResponsePagination<SubmissionStatusType>> => {
  const data = await post(import.meta.env.VITE_APP_API + `problems/${slug}/submit`, requestOptions);
  return data as unknown as ResponsePagination<SubmissionStatusType>;
};

export const getSubmissionDetail = async (submissionId: string): Promise<ResponsePagination<SubmissionDetailType>> => {
  const data = await get(import.meta.env.VITE_APP_API + `problems/submission/${submissionId}`);
  return data as unknown as ResponsePagination<SubmissionDetailType>;
};

export const getSubmissionByUserId = async (userId: string): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API + `problems//user/submissions/${userId}`);
  return data as unknown as ResponsePagination<any>;
};
export const getAverageProblemsPerUser = async (): Promise<ResponsePagination<any>> => {
  const total = await get(import.meta.env.VITE_APP_API + 'problems/average/per-user');
  return total as ResponsePagination<any>;
};

export const getProblemActivities = async (
  userId: string,
  queryOptions: QueryOptions
): Promise<ResponsePagination<PostType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + 'problems/problem-activities/' + userId, {
    params: queryOptions
  });
  return data as unknown as ResponsePagination<PostType[]>;
};
