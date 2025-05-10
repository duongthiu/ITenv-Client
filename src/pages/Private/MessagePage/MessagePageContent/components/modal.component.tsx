import { Avatar, Button, Divider, Dropdown, Form, MenuProps, Modal, Popconfirm, Select, Typography } from 'antd';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FiUserPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { paths } from '../../../../../routes/paths';
import { getFriendsOutSideGroupchat } from '../../../../../services/friend/friend.service';
import { ConversationType } from '../../../../../types/ConversationType';
import { QueryOptions } from '../../../../../types/common';
import { notifyError, notifySuccess } from '../../../../../utils/helpers/notify';
import { setMemberAsAdmin } from '../../../../../services/conversation/conversation.service';
import { updateConversationAction } from '../../../../../redux/message/message.slice';
import { useSocket } from '../../../../../context/SocketContext';

const { Option } = Select;

type MembersModalProps = {
  open: boolean;
  onClose: () => void;
  conversation: ConversationType | null;
  handleRemoveMember: (memberId: string) => void;
  handleAddMember: (friendIds: string[]) => void; // Updated to pass multiple friend IDs
};

const MembersModal: React.FC<MembersModalProps> = ({
  open,
  onClose,
  conversation,
  handleRemoveMember,
  handleAddMember
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const currentUser = useAppSelector((state) => state.user.user);
  const [selectedAddFriends, setSelectedAddFriends] = useState<string[]>([]);
  const [queryOptions] = useState<QueryOptions>({
    page: 1,
    pageSize: 10
  });
  const [addModalVisible, setAddModalVisible] = useState(false);

  const { data: friendsData } = useSWR(
    `friend-${JSON.stringify(queryOptions)}-${conversation?._id}-${addModalVisible}`,
    () => {
      if (addModalVisible) return getFriendsOutSideGroupchat(conversation!._id!, queryOptions);
    }
  );

  const handleAddFriendChange = (values: string[]) => {
    setSelectedAddFriends(values);
  };

  const handleConfirmAddMembers = () => {
    handleAddMember(selectedAddFriends);
    setSelectedAddFriends([]);
    setAddModalVisible(false);
  };
  const handleSetAdmin = async (memberId: string) => {
    try {
      const response = await setMemberAsAdmin(conversation?._id as string, memberId);
      if (response.success) {
        dispatch(updateConversationAction(response.data!));
        notifySuccess('Member set as admin successfully');
        if (socket) socket.emit('update_conversation', response.data!);
      }
    } catch (error: any) {
      notifyError(error.message);
    }
  };

  return (
    <>
      {/* Main Members Modal */}
      <Modal title={<span className="text-lg">Members</span>} open={open} onCancel={onClose} footer={null}>
        <Divider className="my-4" />
        <div className="flex max-h-[300px] flex-col gap-5 overflow-y-auto">
          {conversation?.participants?.map((member) => {
            const isAdmin = currentUser?._id === conversation?.admin;
            const isMemberAdmin = member._id === conversation?.admin;

            const items: MenuProps['items'] = [
              {
                key: '1',
                label: 'Profile',
                onClick: () => navigate(paths.profile.replace(':userId', member._id))
              },
              ...(isAdmin
                ? [
                    {
                      key: '2',
                      label: (
                        <Popconfirm
                          title={`Are you sure you want to set ${member.username} as admin ? You will be removed as admin.`}
                          onConfirm={() => handleSetAdmin(member?._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <span>Set as Admin</span>
                        </Popconfirm>
                      )
                    },
                    {
                      key: '3',
                      label: (
                        <Popconfirm
                          title="Are you sure you want to remove this member?"
                          onConfirm={() => handleRemoveMember(member._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <span>Remove</span>
                        </Popconfirm>
                      )
                    }
                  ]
                : [])
            ];

            return (
              <div key={member._id} className="flex cursor-pointer items-center justify-between gap-4">
                <Avatar
                  onClick={() => navigate(paths.profile.replace(':userId', member._id))}
                  size={42}
                  src={member.avatar}
                />
                <Typography.Text
                  className={`flex-1 ${isMemberAdmin ? 'flex flex-col' : ''}`}
                  onClick={() => navigate(paths.profile.replace(':userId', member._id))}
                >
                  <div>{member.username}</div>
                  {isMemberAdmin && <div className="sub-title text-xs">Admin</div>}
                </Typography.Text>
                {member._id !== currentUser?._id && (
                  <Dropdown menu={{ items }} trigger={['click']}>
                    <BsThreeDots className="cursor-pointer" size={20} />
                  </Dropdown>
                )}
              </div>
            );
          })}
        </div>
        <Button icon={<FiUserPlus />} type="default" className="mt-5" block onClick={() => setAddModalVisible(true)}>
          Add Member
        </Button>
      </Modal>

      {/* Add Friend Modal */}
      <Modal
        title={<span className="text-lg">Add Friends</span>}
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmAddMembers}
            disabled={selectedAddFriends.length < 1}
          >
            Add
          </Button>
        ]}
      >
        <Divider className="my-4" />
        <Form layout="vertical">
          <Form.Item label="Select Friends">
            <Select
              mode="multiple"
              placeholder="Select friends to add"
              onChange={handleAddFriendChange}
              value={selectedAddFriends}
              allowClear
            >
              {friendsData?.data?.map((friend) => {
                const user = friend.sentBy._id === currentUser?._id ? friend.receiver : friend.sentBy;
                return (
                  <Option key={user?._id} value={user?._id}>
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt={user.username} className="h-6 w-6 rounded-full object-cover" />
                      <span>{user.username}</span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MembersModal;
