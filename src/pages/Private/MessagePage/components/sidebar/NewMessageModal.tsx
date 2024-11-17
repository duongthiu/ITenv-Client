import React, { useState } from 'react';
import useSWR from 'swr';
import { Modal, Tabs, Select, Input, Button, Form, Spin } from 'antd';
import { QueryOptions, ResponsePagination } from '../../../../../types/common';
import { FriendType } from '../../../../../types/FriendType';
import { getFriendsByUserId } from '../../../../../services/friend/friend.service';
import { useAppSelector } from '../../../../../redux/app/hook';
import { createGroupChat } from '../../../../../services/conversation/conversation.service';
import { notifyError, notifySuccess } from '../../../../../utils/helpers/notify';
import MessagePageFooter from '../MessagePageFooter/MessagePageFooter.component';
import { MessageType } from '../../../../../types/ConversationType';

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
  const [messageContent, setMessageContent] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { user: userSelector } = useAppSelector((state) => state.user);
  const [messageList, setMessageList] = useState<MessageType[]>([]);
  const [queryOptions, setQueryOptions] = useState<QueryOptions>({ page: 1, pageSize: 20 });
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

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(e.target.value);
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const handleSendMessage = () => {
    console.log('Friend ID:', selectedFriend);
    console.log('Message:', messageContent);
    handleClose();
  };

  const handleCreateGroup = async () => {
    try {
      const response = await createGroupChat(groupName, selectedGroupFriends);
      if (response?.success) {
        notifySuccess('Group chat created successfully');
        mutateConversation && mutateConversation();
        handleClose();
      }
    } catch (error) {
      notifyError(error as string);
    } finally {
      handleClose();
    }
  };

  const filteredFriends = data?.data?.filter((friend) =>
    (friend.sendBy.username + friend.receiver.username).toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(selectedFriend);
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
                    const user = friend.sendBy._id === userSelector?._id ? friend.receiver : friend.sendBy;
                    return (
                      <Option key={user._id} value={user._id}>
                        <div className="flex items-center gap-2">
                          <img src={user.avatar} alt={user.username} className="h-6 w-6 rounded-full object-cover" />
                          <span>{user.username}</span>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <div className="pt-40">
                <MessagePageFooter
                  receiver={selectedFriend!}
                  mutateConversation={mutateConversation!}
                  setMessageList={setMessageList}
                />
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
                      const user = friend.sendBy._id === userSelector?._id ? friend.receiver : friend.sendBy;
                      return (
                        <Option key={user._id} value={user._id}>
                          <div className="flex items-center gap-2">
                            <img src={user.avatar} alt={user.username} className="h-6 w-6 rounded-full object-cover" />
                            <span>{user.username}</span>
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