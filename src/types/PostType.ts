import { UserType } from './UserType';

export type PostType = {
  _id: string;
  postBy: Pick<UserType, '_id' | 'username' | 'avatar'>;
  title: string;
  content: string;
  view: string[];
  vote: string[];
  createdAt: string;
  updatedAt: string;
  comments: CommentType[];
};

export type CommentType = {
  _id: string;
  commentBy: Pick<UserType, '_id' | 'username' | 'avatar'>;
  parentComment?: string;
  isAccepted: boolean;
  content: string;
  createdAt: string;
  updatedAt?: string;
  vote: string[];
};
