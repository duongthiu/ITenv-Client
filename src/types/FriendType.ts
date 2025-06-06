import { UserType } from './UserType';

export type FriendType = {
  _id: string;
  sentBy: Pick<UserType, '_id' | 'username' | 'avatar'>;
  receiver: Pick<UserType, '_id' | 'username' | 'avatar'>;
  status: EnumFriend;
  isBlockBy: Pick<UserType, '_id' | 'username' | 'avatar'>;
  acceptedAt?: Date;
  createdAt?: Date;
};
export enum EnumFriend {
  TYPE_PENDING = 'PENDING',
  TYPE_ACCEPT = 'ACCEPT',
  TYPE_BLOCKED = 'BLOCKED'
}
