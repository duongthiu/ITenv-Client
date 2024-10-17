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
  initialCode: [];
  testCase?: [];
  vote?: number;
  comment?: UserType[];
  postAt: Date;
  editAt?: Date;
  status?: boolean;
};
export type Tags = {
  _id: string;
  name: string;
};
