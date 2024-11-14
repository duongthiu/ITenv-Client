import { useSocket } from '../../context/SocketContext';
import { acceptFriendRequest, createFriendRequest, rejectFriendRequest } from '../../services/friend/friend.service';
import { NotificationTypeEnum } from '../../types/enum/notification.enum';
import { notifyError, notifySuccess } from '../helpers/notify';
import { UseFriendStatusTypeEnum } from './useFriendStatus.hook';
type FriendActionProps = {
  userId: string;
  relationshipId: string;
  setRelationshipState?: (relationship: UseFriendStatusTypeEnum) => void;
  mutate?: () => Promise<void>;
};
export const useFriendAction = (data: FriendActionProps) => {
  const socket = useSocket();
  const { userId, relationshipId, setRelationshipState, mutate } = data;
  const handleAddFriend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (userId) {
        const res = await createFriendRequest({ receiver: userId });
        if (res.success) {
          notifySuccess('Friend request sent successfully');
          if (socket) {
            const notificationPayload = {
              notificationType: NotificationTypeEnum.ACCEPT_FRIEND_REQUEST,
              relationshipId: relationshipId
            };
            socket.emit('notify', notificationPayload);
            setRelationshipState && setRelationshipState(UseFriendStatusTypeEnum.PENDING_SENDING);
            mutate && mutate();
          }
        } else {
          notifyError('Failed to send friend request');
        }
      }
    } catch (error) {
      notifyError('An error occurred');
    }
  };

  const handleRejectFriendRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (userId && relationshipId) {
        const res = await rejectFriendRequest({ friendId: relationshipId });
        if (res.success) {
          notifySuccess('Friend reject successfully');
          if (socket) {
            const notificationPayload = {
              notificationType: NotificationTypeEnum.REJECT_FRIEND_REQUEST,
              relationshipId: relationshipId
            };
            console.log(notificationPayload);
            socket.emit('notify', notificationPayload);
            setRelationshipState && setRelationshipState(UseFriendStatusTypeEnum.NOT_FRIEND);
            mutate && mutate();
          }
        } else {
          notifyError('Failed to reject friend request');
        }
      }
    } catch (error) {
      notifyError('An error occurred');
    }
  };

  const handleAcceptFriendRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (relationshipId) {
        const res = await acceptFriendRequest({ friendId: relationshipId });
        if (res.success) {
          notifySuccess('Friend request sent successfully');
          if (socket) {
            const notificationPayload = {
              notificationType: NotificationTypeEnum.ACCEPT_FRIEND_REQUEST,
              relationshipId: relationshipId
            };
            socket.emit('notify', notificationPayload);
            setRelationshipState && setRelationshipState(UseFriendStatusTypeEnum.FRIEND);
            mutate && mutate();
          }
        } else {
          notifyError('Failed to accept friend request');
        }
      }
    } catch (error) {
      notifyError('An error occurred');
    }
  };
  return {
    handleAddFriend,
    handleRejectFriendRequest,
    handleAcceptFriendRequest
  };
};
