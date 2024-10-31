import { NotificationTypeEnum } from './enum/notification.enum';
import { UserType } from './UserType';

export type NotificationType = {
  title: string;
  content: string;
  isSeen: boolean;
  postedBy: Pick<UserType, '_id' | 'username' | 'avatar' | 'email'>;
  postAt: Date;
  notificationType?: string;
  receivers: string[];
};

//vote downvote comment share repcomment vote_comment downvote_comment
//vote downvote share --> postId
//comment  --> postId, content
//repcomment-->  replied commentId
// vote_comment downvote_comment --> postId, commentId
export type NotificationRequestType = {
  notificationType?: NotificationTypeEnum;
  postId?: string;
  content?: string;
  commentId?: string;
  // problemId?: string;
};
