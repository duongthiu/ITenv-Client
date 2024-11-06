import { EnumFriend, FriendType } from '../../types/FriendType';

interface UseFriendStatusType {
  friendWithMe?: FriendType;
  userId: string;
}

export enum UseFriendStatusTypeEnum {
  PENDING_SENDING = 'PENDING_SENDING',
  PENDING_RECEIVING = 'PENDING_RECEIVING',
  FRIEND = 'FRIEND',
  BLOCKED = 'BLOCKED',
  NOT_FRIEND = 'NOT_FRIEND'
}

const useFriendStatus = (data: UseFriendStatusType): UseFriendStatusTypeEnum => {
  const { friendWithMe, userId } = data;

  if (!friendWithMe) {
    return UseFriendStatusTypeEnum.NOT_FRIEND;
  }

  if (friendWithMe.status === EnumFriend.TYPE_BLOCKED) {
    return friendWithMe.isBlockBy?._id === userId
      ? UseFriendStatusTypeEnum.BLOCKED
      : UseFriendStatusTypeEnum.NOT_FRIEND;
  }

  if (friendWithMe.status === EnumFriend.TYPE_ACCEPT) {
    return UseFriendStatusTypeEnum.FRIEND;
  }

  if (friendWithMe.status === EnumFriend.TYPE_PENDING) {
    return friendWithMe.sendBy === userId
      ? UseFriendStatusTypeEnum.PENDING_SENDING
      : UseFriendStatusTypeEnum.PENDING_RECEIVING;
  }

  return UseFriendStatusTypeEnum.NOT_FRIEND;
};

export default useFriendStatus;
