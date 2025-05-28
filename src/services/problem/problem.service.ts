import { get, post } from '../../apis';
import { CategoryType } from '../../types/CategoryType';
import { QueryOptions, ResponsePagination } from '../../types/common';
import { EnumLevelProblem } from '../../types/enum/schemaProblem.enum';
import { PostType } from '../../types/PostType';
import { ProblemType, RunCodeResultType, SubmissionDetailType } from '../../types/ProblemType';

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
  typed_code: string;
};

export const runCode = async (
  slug: string,
  requestOptions: submitCodeQueryOptions
): Promise<ResponsePagination<RunCodeResultType>> => {
  const data = await post(import.meta.env.VITE_APP_API + `problems/${slug}/run`, requestOptions);
  return data as unknown as ResponsePagination<RunCodeResultType>;
};

export const submitCode = async (
  slug: string,
  requestOptions: submitCodeQueryOptions
): Promise<ResponsePagination<RunCodeResultType>> => {
  const data = await post(import.meta.env.VITE_APP_API + `problems/${slug}/submit`, requestOptions);
  return data as unknown as ResponsePagination<RunCodeResultType>;
};


export const getSubmissionDetail = async (submissionId: string): Promise<ResponsePagination<SubmissionDetailType>> => {
  const data = await get(import.meta.env.VITE_APP_API + `problems/submission/${submissionId}`);
  return data as unknown as ResponsePagination<SubmissionDetailType>;
};

export const getSubmissionByUserId = async (userId: string): Promise<ResponsePagination<SubmissionDetailType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + `problems/submissions/${userId}`);
  return data as unknown as ResponsePagination<SubmissionDetailType[]>;
};

export const getSubmissionsByUserAndProblem = async (
  userId: string,
  slug: string
): Promise<ResponsePagination<SubmissionDetailType[]>> => {
  const data = await get(import.meta.env.VITE_APP_API + `problems/submissions/${userId}/problem`, {
    params: { slug: slug }
  });
  return data as unknown as ResponsePagination<SubmissionDetailType[]>;
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

export type CreateProblemRequest = {
  title: string;
  slug: string;
  content: string;
  level: EnumLevelProblem;
  tags: string[];
  hint: string[];
  initialCode: {
    lang: string;
    langSlug: string;
    code: string;
  }[];
  testCase: {
    input: {
      name: string;
      value: string;
    }[];
    output: string[];
    isHidden: boolean;
  }[];
  exampleTestcases: string;
};

export const createProblem = async (requestOptions: CreateProblemRequest): Promise<ResponsePagination<ProblemType>> => {
  const data = await post(import.meta.env.VITE_APP_API + 'problems', requestOptions);
  return data as unknown as ResponsePagination<ProblemType>;
};

// export const getProblemById = async (id: string) => {
//   null;
// };

// export const updateProblem = async (id: string, data: CreateProblemRequest) => {
//   null;
// };
