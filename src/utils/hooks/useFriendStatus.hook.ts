import { EnumFriend, FriendType } from '../../types/FriendType';

interface UseFriendStatusType {
  friendWithMe?: FriendType;
  currentUserId: string;
}

export enum UseFriendStatusTypeEnum {
  PENDING_SENDING = 'PENDING_SENDING',
  PENDING_RECEIVING = 'PENDING_RECEIVING',
  FRIEND = 'FRIEND',
  BLOCKED = 'BLOCKED',
  NOT_FRIEND = 'NOT_FRIEND'
}

const useFriendStatus = (data: UseFriendStatusType): UseFriendStatusTypeEnum => {
  const { friendWithMe, currentUserId } = data;

  if (!friendWithMe) {
    return UseFriendStatusTypeEnum.NOT_FRIEND;
  }

  if (friendWithMe.status === EnumFriend.TYPE_BLOCKED) {
    return friendWithMe.isBlockBy?._id === currentUserId
      ? UseFriendStatusTypeEnum.BLOCKED
      : UseFriendStatusTypeEnum.NOT_FRIEND;
  }

  if (friendWithMe.status === EnumFriend.TYPE_ACCEPT) {
    return UseFriendStatusTypeEnum.FRIEND;
  }

  if (friendWithMe.status === EnumFriend.TYPE_PENDING) {
    return friendWithMe.sendBy._id === currentUserId
      ? UseFriendStatusTypeEnum.PENDING_SENDING
      : UseFriendStatusTypeEnum.PENDING_RECEIVING;
  }

  return UseFriendStatusTypeEnum.NOT_FRIEND;
};

export default useFriendStatus;
