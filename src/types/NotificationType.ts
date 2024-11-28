import { NotificationTypeEnum } from './enum/notification.enum';
import { UserType } from './UserType';

export type NotificationType = {
  _id?: string;
  title: string;
  content: string;
  isSeen: boolean;
  postedBy: Pick<UserType, '_id' | 'username' | 'avatar' | 'email'>;
  createdAt: Date;
  notificationType?: NotificationTypeEnum;
  receivers: string[];
  postId?: string;
  isGlobal?: boolean;
};

//vote downvote comment share repcomment vote_comment downvote_comment
//vote downvote share --> postId
//comment  --> postId, content
//repcomment-->  replied commentId, content
// vote_comment downvote_comment --> postId, commentId
export type NotificationRequestType = {
  notificationType?: NotificationTypeEnum;
  postId?: string;
  content?: string;
  commentId?: string;
  title?: string;
  receiverId?: string[];
  // problemId?: string;
};
