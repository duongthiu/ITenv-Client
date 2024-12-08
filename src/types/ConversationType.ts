import { UserType } from './UserType';

export type ConversationType = {
  _id?: string;
  createdBy: Pick<UserType, '_id' | 'username' | 'avatar' | 'status' | 'lastOnline'>;
  participants: Pick<UserType, '_id' | 'username' | 'avatar' | 'status' | 'lastOnline'>[];
  isGroupChat?: boolean;
  groupName?: string;
  isDeleted?: boolean;
  lastMessage?: MessageType;
  createdAt?: Date;
  admin?: string;
  groupAvatar?: string;
};

export type MessageType = {
  _id?: string;
  conversationId: string;
  sender: Pick<UserType, '_id' | 'username' | 'avatar'>;
  isSeenBy: string[];
  hasText: boolean;
  hasFile: boolean;
  content: string;
  file?: PreviewImage[];
  fileUrl?: string[];
  isRecalled: boolean;
  isDeleted: boolean;
  parentMessage?: MessageType;
  createdAt?: Date;
  conversation?: ConversationType;
  notificationMessage?: boolean;
};
export type PreviewImage = { name: string; path: string };
