import { TagType } from './TagType';
import { UserType } from './UserType';

export type ProblemType = {
  title: string;
  slug: string;
  content: string;
  level: string;
  tags: TagType[];
  acceptance?: UserType[];
  submitBy?: UserType[];
  hint: string[];
  exampleTestcases: string;
  initialCode: InitialCode[];
  testCase?: [];
  vote?: number;
  comment?: UserType[];
  questionId: string;
  frontendQuestionId: string;
  postAt: Date;
  editAt?: Date;
  status?: boolean;
};
export type InitialCode = {
  lang: string;
  langSlug: string;
  code: string;
  _id: string;
};
export type Tags = {
  _id: string;
  name: string;
};
export type SubmissionStatusType = {
  status_code: number;
  lang: string;
  run_success: boolean;
  compile_error: string;
  full_compile_error?: string;
  full_runtime_error?: string;
  status_runtime: string;
  memory: number;
  question_id: string;
  task_finish_time: number;
  task_name: string;
  finished: boolean;
  total_correct: number | null;
  total_testcases: number | null;
  runtime_percentile: number | null;
  status_memory: string;
  memory_percentile: number | null;
  pretty_lang: string;
  submission_id: string;
  status_msg: string;
  state: string;
};

export type SubmissionDetailType = {
  runtime: number;
  runtimeDisplay: string;
  runtimePercentile: number | null;
  runtimeDistribution: string; // JSON string, should be parsed if you need an object
  memory: number;
  memoryDisplay: string;
  memoryPercentile: number | null;
  memoryDistribution: string; // JSON string, should be parsed if you need an object
  code: string;
  timestamp: number; // Unix timestamp
  statusCode: number;
  user: {
    username: string;
    profile: {
      realName: string;
      userAvatar: string;
    };
  };
  lang: {
    name: string;
    verboseName: string;
  };
  question: {
    questionId: string;
    titleSlug: string;
    hasFrontendPreview: boolean;
  };
  notes: string;
  flagType: string;
  topicTags: string[];
  runtimeError: string | null;
  compileError: string | null;
  lastTestcase: string | null;
  codeOutput: string | null; // JSON string, should be parsed if you need an object
  expectedOutput: string | null;
  totalCorrect: number | null;
  totalTestcases: number;
  fullCodeOutput: string | null;
  testDescriptions: string | null;
  testBodies: string | null;
  testInfo: string | null;
  stdOutput: string | null;
};

export type AverageProblemsResponse = {
  average: number;
  total: number;
}
