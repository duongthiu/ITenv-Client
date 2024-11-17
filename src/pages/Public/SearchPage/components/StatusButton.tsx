import { Button, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { useFriendAction } from '../../../../utils/hooks/useFriendAction.hook';
import { UseFriendStatusTypeEnum } from '../../../../utils/hooks/useFriendStatus.hook';
import NewMessageModal from '../../../Private/MessagePage/components/sidebar/NewMessageModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
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
        <div className="flex w-full items-center justify-end gap-3">
          <div onClick={(e) => e.stopPropagation()}>
            <Popconfirm
              title="Are you sure to delete this friend?"
              onConfirm={(e) => handleRejectFriendRequest(e as unknown as React.MouseEvent)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="default" className="flex-1">
                Unfriend
              </Button>
            </Popconfirm>
          </div>
          <Button className="flex-1" type="primary" onClick={handleModalOpen}>
            Message
          </Button>
        </div>
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
      <NewMessageModal isModalOpen={isModalOpen} handleClose={handleModalClose} receiverId={userId} />
    </div>
  );
};

export default StatusButton;
