/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryOptions, ResponsePagination } from '../types/common';
import { get, post } from '../apis/index';

export const getPosts = async (queryOption: QueryOptions): Promise<ResponsePagination<any>> => {
  const data = await get(import.meta.env.VITE_APP_API_POST_GET_POSTS, {
    params: queryOption
  });
  return data as any;
};

type CodeCompilerType = {
  code: string;
  language: string;
};
export const runCode = async (queryOption: CodeCompilerType): Promise<any> => {
  try {
    const response = await post<any, { code: string; language: string }>('http://localhost:4000/api/problems/compile', {
      code: queryOption.code!,
      language: queryOption.language!
    });
    return response as any;
  } catch (error) {
    console.error('Error running code:', error);
    throw error;
  }
};
export interface SubmissionBody {
  lang: string; // Language of the submission (e.g., "python", "javascript")
  typed_code: string; // The code that the user has written
  question_id: number; // ID of the question being submitted
}
export type CodeSubmitType = {
  name: string;
  submissionBody: SubmissionBody;
};
export const submitCode = async (queryOption: CodeSubmitType): Promise<any> => {
  try {
    const response = await post<any, SubmissionBody>(
      `http://localhost:4000/api/problems/${queryOption.name}/submit/`,
      queryOption.submissionBody
    );
    return response as any;
  } catch (error) {
    console.error('Error submitting code:', error);
    throw error;
  }
};
