import { Avatar, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { BsInfoCircleFill } from 'react-icons/bs';
import { GoDotFill } from 'react-icons/go';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { useSocket } from '../../../../../context/SocketContext';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { toggleConversationInfo, updateConversationAction } from '../../../../../redux/message/message.slice';
import { addMember, removeMember } from '../../../../../services/conversation/conversation.service';
import { ConversationType } from '../../../../../types/ConversationType';
import { notifyError, notifySuccess } from '../../../../../utils/helpers/notify';
import timeAgo from '../../../../../utils/helpers/timeAgo';
import MembersModal from './modal.component';

type HeaderProps = {
  conversation: ConversationType | null;
};

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const { user } = useAppSelector((state) => state.user);
  const socket = useSocket();
  const conversationInfo = conversation?.participants?.find((member) => member?._id !== user?._id);
  const [openMemberModal, setOpenMemberModal] = useState<boolean>(false);
  const { isOpenConversationInfo } = useAppSelector((state) => state.conversation);

  const dispatch = useAppDispatch();
  // Handler for removing a member
  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await removeMember(conversation?._id as string, memberId);
      if (response.success) {
        setOpenMemberModal(false);
        dispatch(updateConversationAction(response.data!));
        notifySuccess('Member removed successfully');
        if (socket) {
          socket.emit('remove_member', { conversation: response.data!, memberId: memberId });
        }
      } else {
        notifyError(response?.message || 'Something went wrong. Please try again...');
      }
    } catch (error) {
      notifyError((error as Error).message);
    }
  };
  const handleAddMember = async (friendIds: string[]) => {
    try {
      const response = await addMember(conversation?._id as string, friendIds);
      if (response.success) {
        setOpenMemberModal(false);
        dispatch(updateConversationAction(response.data!));
        notifySuccess('Member added successfully');
        if (socket) {
          socket.emit('add_member', { conversation: response.data!, memberIds: friendIds });
        }
      } else {
        notifyError(response?.message || 'Failed to add member. Please try again.');
      }
    } catch (error) {
      notifyError((error as Error).message);
    }
  };
  return (
    <div className="flex items-center justify-between p-3">
      {conversation?.isGroupChat && (
        <>
          <MembersModal
            open={openMemberModal}
            onClose={() => setOpenMemberModal(false)}
            conversation={conversation}
            handleRemoveMember={handleRemoveMember}
            handleAddMember={handleAddMember}
          />
        </>
      )}
      <div className="flex items-center gap-5">
        <Avatar
          size={42}
          icon={conversation?.isGroupChat && !conversation?.groupAvatar && <HiOutlineUserGroup />}
          src={
            conversation?.isGroupChat && conversation?.groupAvatar
              ? conversation.groupAvatar
              : !conversation?.isGroupChat &&
                conversation?.participants?.find((member) => member?._id !== user?._id)?.avatar
          }
        />
        <div className="content flex flex-2 items-center justify-between">
          <div className="flex flex-col justify-center">
            <Typography.Text strong className="text-[1.4rem]">
              {conversation?.isGroupChat
                ? conversation?.groupName
                : conversation?.participants?.find((member) => member?._id !== user?._id)?.username}
            </Typography.Text>
            <div className="flex gap-3">
              {conversation?.isGroupChat ? (
                <Typography.Link className="text-[1.2rem]" onClick={() => setOpenMemberModal(true)}>
                  {conversation?.participants?.length} members
                </Typography.Link>
              ) : (
                <div className={`${conversationInfo?.status && 'text-green-500'} flex items-center`}>
                  <GoDotFill size={18} />
                  <Typography.Text
                    className={`inline text-[1.2rem] tracking-tight ${conversationInfo?.status && 'text-green-500'}`}
                  >
                    {conversationInfo?.status ? 'Online' : 'Offline ' + timeAgo(conversationInfo?.lastOnline || '')}
                  </Typography.Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tooltip title={isOpenConversationInfo ? 'Close info' : 'Open info'}>
        <BsInfoCircleFill
          className={`cursor-pointer duration-300 hover:opacity-100 ${isOpenConversationInfo ? 'opacity-100' : 'opacity-60'}`}
          size={25}
          onClick={() => dispatch(toggleConversationInfo())}
        />
      </Tooltip>
    </div>
  );
};

export default Header;
