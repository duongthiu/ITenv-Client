import { UserType } from './UserType';

export type FriendType = {
  _id: string;
  sendBy: Pick<UserType, '_id' | 'username' | 'avatar'>;
  receiver: Pick<UserType, '_id' | 'username' | 'avatar'>;
  status: EnumFriend;
  isBlockBy: UserType;
  acceptedAt?: Date;
  createdAt?: Date;
};
export enum EnumFriend {
  TYPE_PENDING = 'PENDING',
  TYPE_ACCEPT = 'ACCEPT',
  TYPE_BLOCKED = 'BLOCKED'
}
