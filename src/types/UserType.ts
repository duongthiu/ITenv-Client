import { EnumGengerUser } from './enum/GenderEnum.enum';
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
  gender?: EnumGengerUser;
  status: boolean;
  lastOnline: Date;
  email: string;
  role: string;
  isBlocked: boolean;
  friendWithMe?: FriendType;
  createdAt?: Date;
  
};

