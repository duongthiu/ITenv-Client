import { UserType } from "./UserType";

export type NotificationType = {
  title: string;
  content: string;
  isSeen: boolean;
  postedBy:  Pick<UserType, '_id' | 'username' | 'avatar' | 'email'>;
  postAt: Date;
  notificationType?: string;
};
