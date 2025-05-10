import { Button, Empty, Form, Input, Modal, Select, Spin, Tabs } from 'antd';
import React, { useState } from 'react';
import useSWR from 'swr';
import { useSocket } from '../../../../../context/SocketContext';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { addConversation } from '../../../../../redux/message/message.slice';
import { createGroupChat } from '../../../../../services/conversation/conversation.service';
import { getFriendsByUserId } from '../../../../../services/friend/friend.service';
import { getMyConversationWithUser } from '../../../../../services/message/message.service';
import { QueryOptions, ResponsePagination } from '../../../../../types/common';
import { FriendType } from '../../../../../types/FriendType';
import { notifyError, notifySuccess } from '../../../../../utils/helpers/notify';
import MessageItem from '../MessageItem/MessageItem';
import MessagePageFooter from '../MessagePageFooter/MessagePageFooter.component';

const { Option } = Select;
const { TabPane } = Tabs;

type NewMessageModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  mutateConversation?: () => Promise<void>;
  receiverId?: string;
};

const NewMessageModal: React.FC<NewMessageModalProps> = ({
  isModalOpen,
  handleClose,
  mutateConversation,
  receiverId
}) => {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(receiverId || null);
  const [selectedGroupFriends, setSelectedGroupFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { user: userSelector } = useAppSelector((state) => state.user);
  const [queryOptions] = useState<QueryOptions>({ page: 1, pageSize: 20 });
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { data: messagesData, isLoading } = useSWR(selectedFriend ? `message-${selectedFriend}` : null, () =>
    getMyConversationWithUser(selectedFriend!, {})
  );
  // Use SWR to fetch friends
  const { data, error, isValidating } = useSWR<ResponsePagination<FriendType[]>>(
    ['friends', userSelector?._id, JSON.stringify(queryOptions)],
    () => getFriendsByUserId(userSelector?._id || '', queryOptions)
  );

  const handleFriendChange = (value: string) => {
    setSelectedFriend(value);
  };

  const handleGroupFriendChange = (values: string[]) => {
    setSelectedGroupFriends(values);
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const handleCreateGroup = async () => {
    try {
      const response = await createGroupChat(groupName, selectedGroupFriends);
      if (response?.success) {
        notifySuccess('Group chat created successfully');
        mutateConversation && mutateConversation();
        handleClose();
        dispatch(addConversation(response.data!));
        if (socket) {
          console.log('emit');
          socket.emit('create_group', response.data!);
        }
      }
    } catch (error) {
      notifyError(error as string);
    } finally {
      handleClose();
    }
  };

  const filteredFriends = data?.data?.filter((friend) =>
    (friend?.sentBy?.username + friend?.receiver?.username).toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Modal
      title="New Message"
      open={isModalOpen}
      onCancel={handleClose}
      footer={null} // Footer controlled inside tabs
    >
      {error ? (
        <div>Error fetching friends</div>
      ) : isValidating ? (
        <Spin size="large" />
      ) : (
        <Tabs defaultActiveKey="1">
          {/* Tab 1: Send New Message */}
          <TabPane tab="Send New Message" key="1">
            <Form layout="vertical">
              <Form.Item layout="horizontal" label="To" required>
                <Select
                  showSearch
                  placeholder="Search and select a friend"
                  onChange={handleFriendChange}
                  onSearch={setSearchTerm}
                  filterOption={false}
                  value={selectedFriend}
                  allowClear={!receiverId}
                  disabled={!!receiverId}
                >
                  {filteredFriends?.map((friend) => {
                    const user = friend?.sentBy?._id === userSelector?._id ? friend.receiver : friend.sentBy;
                    return (
                      <Option key={user?._id} value={user?._id}>
                        <div className="flex items-center gap-2">
                          <img src={user?.avatar} alt={user?.username} className="h-6 w-6 rounded-full object-cover" />
                          <span>{user?.username}</span>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <div className="flex h-[200px] flex-col-reverse gap-0 overflow-y-auto p-5">
                <div className="mt-auto flex flex-col gap-2">
                  {isLoading ? (
                    <Spin size="default" />
                  ) : messagesData?.data?.length ? (
                    messagesData.data.map((message) => <MessageItem key={message?._id} message={message} />)
                  ) : (
                    <Empty description="No messages yet" />
                  )}
                </div>
              </div>
              <div className="pt-5">
                <MessagePageFooter receiver={selectedFriend!} />
              </div>
            </Form>
          </TabPane>

          {/* Tab 2: Create Group */}
          {!receiverId && (
            <TabPane tab="Create Group" key="2">
              <Form layout="vertical">
                <Form.Item layout="horizontal" label="Group Name">
                  <Input placeholder="Enter group name" onChange={handleGroupNameChange} value={groupName} />
                </Form.Item>

                <Form.Item label="Select Friends">
                  <Select
                    mode="multiple"
                    placeholder="Select at least 2 friends"
                    onChange={handleGroupFriendChange}
                    value={selectedGroupFriends}
                    allowClear
                  >
                    {filteredFriends?.map((friend) => {
                      const user = friend?.sentBy?._id === userSelector?._id ? friend.receiver : friend.sentBy;
                      return (
                        <Option key={user?._id} value={user?._id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={user?.avatar}
                              alt={user?.username}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                            <span>{user?.username}</span>
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    disabled={selectedGroupFriends.length < 2 || !groupName}
                    onClick={handleCreateGroup}
                  >
                    Create Group
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          )}
        </Tabs>
      )}
    </Modal>
  );
};

export default NewMessageModal;
