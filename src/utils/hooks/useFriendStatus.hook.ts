import { EnumFriend, FriendType } from '../../types/FriendType';

interface UseFriendStatusType {
  friends: FriendType[];
  userId: string;
}

enum UseFriendStatusTypeEnum {
  PENDING_SENDING = 'PENDING_SENDING',
  PENDING_RECEIVING = 'PENDING_RECEIVING',
  FRIEND = 'FRIEND',
  BLOCKED = 'BLOCKED',
  NOT_FRIEND = 'NOT_FRIEND'
}

const useFriendStatus = (data: UseFriendStatusType) => {
  const { friends, userId } = data;

  return friends.map((friend) => {
    if (friend.status === EnumFriend.TYPE_BLOCKED) {
      return {
        ...friend,
        relationshipStatus:
          friend.isBlockBy._id === userId ? UseFriendStatusTypeEnum.BLOCKED : UseFriendStatusTypeEnum.NOT_FRIEND
      };
    }

    if (friend.status === EnumFriend.TYPE_ACCEPT) {
      return { ...friend, relationshipStatus: UseFriendStatusTypeEnum.FRIEND };
    }

    if (friend.status === EnumFriend.TYPE_PENDING) {
      if (friend.sendBy === userId) {
        return { ...friend, relationshipStatus: UseFriendStatusTypeEnum.PENDING_SENDING };
      } else {
        return { ...friend, relationshipStatus: UseFriendStatusTypeEnum.PENDING_RECEIVING };
      }
    }

    return { ...friend, relationshipStatus: UseFriendStatusTypeEnum.NOT_FRIEND };
  });
};

export default useFriendStatus;
