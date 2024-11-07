import React, { useState } from 'react';
import { UseFriendStatusTypeEnum } from '../../../../utils/hooks/useFriendStatus.hook';
import { Button } from 'antd';
import { acceptFriendRequest, createFriendRequest, rejectFriendRequest } from '../../../../services/user/user.service';
import { notifyError, notifySuccess } from '../../../../utils/helpers/notify';
import { useAppSelector } from '../../../../redux/app/hook';
import { useNavigate } from 'react-router-dom';
import { UserType } from '../../../../types/UserType';

type StatusButtonProps = {
  relationship: UseFriendStatusTypeEnum;
  user: UserType;
  relationshipId: string;
};
const StatusButton: React.FC<StatusButtonProps> = ({ relationship, user, relationshipId }) => {
  const navigate = useNavigate();
  const { user: userSelector } = useAppSelector((state) => state.user);
  const [relationshipState, setRelationshipState] = useState(relationship);
  const handleAddFriend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (user?._id) {
        const res = await createFriendRequest({ receiver: user._id });
        if (res.success) {
          notifySuccess('Friend request sent successfully');
          setRelationshipState(UseFriendStatusTypeEnum.PENDING_SENDING);
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
      if (user?._id && relationshipId) {
        const res = await rejectFriendRequest({ friendId: relationshipId });
        if (res.success) {
          notifySuccess('Friend request rejected successfully');
          setRelationshipState(UseFriendStatusTypeEnum.NOT_FRIEND);
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
          notifySuccess('Friend request accepted successfully');
          setRelationshipState(UseFriendStatusTypeEnum.FRIEND);
        } else {
          notifyError('Failed to accept friend request');
        }
      }
    } catch (error) {
      notifyError('An error occurred');
    }
  };
  return (
    <div className="flex w-full gap-3">
      {/* <Button className="w-full rounded-full" type="default" onClick={() => navigate(`/profile/${user?._id}`)}>
        Profile
      </Button> */}
      {relationshipState === UseFriendStatusTypeEnum.NOT_FRIEND && (
        <Button
          onClick={handleAddFriend}
          className="w-full rounded-full bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600"
        >
          Add Friend
        </Button>
      )}
      {relationshipState === UseFriendStatusTypeEnum.PENDING_SENDING && (
        <Button
          onClick={handleRejectFriendRequest}
          type="default"
          className="w-full rounded-full bg-red-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-red-600"
        >
          Cancel Request
        </Button>
      )}
      {relationshipState === UseFriendStatusTypeEnum.PENDING_RECEIVING && (
        <div className="flex w-full items-center gap-5">
          <Button
            onClick={handleRejectFriendRequest}
            type="default"
            className="w-full rounded-full bg-red-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-red-600"
          >
            Cancel Request
          </Button>
          <Button
            onClick={handleAcceptFriendRequest}
            className="w-full rounded-full bg-green-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-green-600"
          >
            Accept Request
          </Button>
        </div>
      )}
      {relationshipState === UseFriendStatusTypeEnum.FRIEND && (
        <Button
          onClick={handleRejectFriendRequest}
          type="default"
          className="w-full rounded-full bg-gray-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-gray-600"
        >
          Unfriend
        </Button>
      )}
      {relationshipState === UseFriendStatusTypeEnum.BLOCKED && (
        <Button
          onClick={() => alert('Unblock logic here')}
          type="default"
          className="w-full rounded-full bg-gray-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-gray-600"
        >
          Unblock
        </Button>
      )}
    </div>
  );
};

export default StatusButton;
