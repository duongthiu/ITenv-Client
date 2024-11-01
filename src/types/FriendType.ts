import { UserType } from './UserType';

export type FriendType = {
  _id: string;
  sendBy: string | Pick<UserType, '_id' | 'username' | 'avatar'>;
  receiver: string | Pick<UserType, '_id' | 'username' | 'avatar'>;
  status: EnumFriend;
  isBlockBy: UserType;
  acceptedAt?: Date;
};
export enum EnumFriend {
  TYPE_PENDING = 'PENDING',
  TYPE_ACCEPT = 'ACCEPT',
  TYPE_BLOCKED = 'BLOCKED'
}
