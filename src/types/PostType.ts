import { TagType } from './TagType';
import { UserType } from './UserType';

export type PostType = {
  _id: string;
  postedBy?: Pick<UserType, '_id' | 'username' | 'avatar' | 'email'>;
  title: string;
  tags: TagType[];
  content: string;
  view: string[];
  vote: string[];
  downVote: string[];
  createdAt: string;
  updatedAt: string;
  totalComment?: number;
  isAnonymous?: boolean;
  resolve: boolean;
  isDeleted?: boolean;
};

export type CommentType = {
  _id?: string;
  commentedBy: Pick<UserType, '_id' | 'username' | 'avatar'>;
  children?: CommentType[];
  parentComment?: string;
  isAccepted?: boolean;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  vote?: string[];
  downVote?: string[];
  resolve: boolean;
};
