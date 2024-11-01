import { FriendType } from './FriendType';
import { NotificationType } from './NotificationType';
import { PostType } from './PostType';
import { SubmissionType } from './SubmissionType';

export type UserType = {
  _id: string;
  username: string;
  dob?: Date;
  phoneNumber?: string;
  avatar: string;
  posts?: PostType[];
  friends?: FriendType[] | Pick<UserType, '_id' | 'username' | 'avatar'>[];
  notifications?: NotificationType[];
  submissions: SubmissionType[];
  gender?: number;
  status: boolean;
  lastOnline: Date;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt?: Date;
};
