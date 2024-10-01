import { UserType } from './UserType';

export type ProblemType = {
  title: string;
  slug: string;
  content: string;
  level: string;
  tags: string[];
  acceptance?: UserType[];
  submitBy?: UserType[];
  hint: string[];
  initialCode: [];
  testCase?: [];
  vote?: number;
  comment?: UserType[];
  postAt: Date;
  editAt?: Date;
  status?: boolean;
};
