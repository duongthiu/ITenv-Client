import { NotificationType } from './NotificationType';
import { PostType } from './PostType';
import { SubmissionType } from './SubmissionType';

export type UserType = {
  username?: string;
  dob?: Date;
  phoneNumber?: string;
  avatar: string;
  posts?: PostType[];
  notifications?: NotificationType[];
  submissions: SubmissionType[];
  gender?: number;
  status: number;
  lastOnline: Date;
  email: string;
  role: string;
  isBlocked: boolean;
};
