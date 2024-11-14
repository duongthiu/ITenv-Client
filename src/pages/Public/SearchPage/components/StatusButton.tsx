import { Button } from 'antd';
import React, { useState } from 'react';
import { useFriendAction } from '../../../../utils/hooks/useFriendAction.hook';
import { UseFriendStatusTypeEnum } from '../../../../utils/hooks/useFriendStatus.hook';

type StatusButtonProps = {
  relationship: UseFriendStatusTypeEnum;
  userId: string;
  relationshipId: string;
};
const StatusButton: React.FC<StatusButtonProps> = ({ relationship, userId, relationshipId }) => {
  const [relationshipState, setRelationshipState] = useState(relationship);
  const { handleAddFriend, handleRejectFriendRequest, handleAcceptFriendRequest } = useFriendAction({
    userId,
    relationshipId,
    setRelationshipState
  });
  return (
    <div className="flex w-full justify-end gap-3">
      {/* <Button className="w-full rounded-full" type="default" onClick={() => navigate(`/profile/${user?._id}`)}>
        Profile
      </Button> */}
      {relationshipState === UseFriendStatusTypeEnum.NOT_FRIEND && (
        <Button type="primary" className="flex-1" onClick={handleAddFriend}>
          Add Friend
        </Button>
      )}
      {relationshipState === UseFriendStatusTypeEnum.PENDING_SENDING && (
        <Button type="default" className="flex-1" onClick={handleRejectFriendRequest}>
          Cancel Request
        </Button>
      )}
      {relationshipState === UseFriendStatusTypeEnum.PENDING_RECEIVING && (
        <div className="flex w-full items-center justify-end gap-3">
          <Button type="default" className="flex-1" onClick={handleRejectFriendRequest}>
            Decline
          </Button>
          <Button type="primary" className="flex-1" onClick={handleAcceptFriendRequest}>
            Accept
          </Button>
        </div>
      )}
      {relationshipState === UseFriendStatusTypeEnum.FRIEND && (
        <Button type="default" className="flex-1" onClick={handleRejectFriendRequest}>
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
