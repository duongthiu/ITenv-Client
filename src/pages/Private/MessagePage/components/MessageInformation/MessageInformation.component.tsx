import { Avatar, Button, Menu, MenuProps, Modal, Input, Typography, Spin, Tooltip, Popconfirm } from 'antd';
import { Edit, LinkIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BsCheck, BsInfoCircleFill } from 'react-icons/bs';
import { GoDotFill } from 'react-icons/go';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { IoIosImages } from 'react-icons/io';
import { IoClose, IoExitOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { paths } from '../../../../../routes/paths';
import { ConversationType } from '../../../../../types/ConversationType';
import { formatDateWithoutTime } from '../../../../../utils/helpers/formatDate';
import timeAgo from '../../../../../utils/helpers/timeAgo';
import './MessageInformation.style.scss';
import {
  changeGroupAvatar,
  changeGroupName,
  leaveGroupChat
} from '../../../../../services/conversation/conversation.service';
import { notifyError, notifySuccess } from '../../../../../utils/helpers/notify';
import { removeConversation, updateConversationAction } from '../../../../../redux/message/message.slice';
import { setLoading } from '../../../../../redux/user/user.slice';
import { getBase64 } from '../../../../../utils/helpers/getBase64';
import { useSocket } from '../../../../../context/SocketContext';

type MessageInformationProps = {
  conversation: ConversationType;
};

const MessageInformation: React.FC<MessageInformationProps> = ({ conversation }) => {
  type MenuItem = Required<MenuProps>['items'][number];
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const [isModalChangeName, setIsModalChangeName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(conversation?.groupName || '');
  const { user } = useAppSelector((state) => state.user);
  const conversationInfo = conversation?.participants?.find((member) => member?._id !== user?._id);
  const [avatar, setAvatar] = useState<{ src: string; file?: File }>({
    src: conversation?.isGroupChat
      ? conversation?.groupAvatar || ''
      : conversation?.participants?.find((member) => member?._id !== user?._id)?.avatar || ''
  });
  const oldAvatar = useMemo(() => {
    return conversation?.isGroupChat
      ? conversation?.groupAvatar || ''
      : conversation?.participants?.find((member) => member?._id !== user?._id)?.avatar || '';
  }, [conversation._id, conversation?.groupAvatar]);

  const { loading } = useAppSelector((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const items: MenuItem[] = useMemo(() => {
    const menuItems = [
      {
        key: 'chat-info',
        label: 'Chat info',
        icon: <BsInfoCircleFill size={20} />,
        children: [
          {
            key: 'g1',
            label: `Created at ${formatDateWithoutTime(conversation.createdAt!)}`,
            type: 'label'
          }
        ]
      },
      {
        key: 'media',
        label: 'Media, files and links',
        icon: <LinkIcon size={20} />,
        children: []
      }
    ];

    if (conversation?.isGroupChat)
      menuItems.push({
        key: 'member',
        label: 'Members',
        icon: <UserIcon size={20} />,
        children: conversation?.participants?.map((member) => ({
          key: member._id!,
          label: (
            <div
              className="flex items-center gap-3"
              onClick={() => navigate(paths.profile.replace(':userId', member._id!))}
            >
              <Avatar src={member?.avatar} size="default">
                {member?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography.Text className="text-[1.4rem]">{member?.username}</Typography.Text>
            </div>
          ),
          type: 'label'
        }))
      });

    if (conversation?.isGroupChat && conversation?.admin === user?._id)
      menuItems.push({
        key: 'customize-chat',
        label: 'Customize chat',
        icon: <BsInfoCircleFill size={20} />,
        children: [
          {
            key: 'change-group-name',
            label: 'Change group name',
            type: 'label',
            icon: <Edit size={20} />,
            onClick: () => {
              setIsModalChangeName(true); // Show modal on click
            }
          },
          {
            key: 'change-group-photo',
            label: 'Change group photo',
            type: 'label',
            icon: <IoIosImages size={20} />,
            onClick: () => {
              handleIconClick();
            }
          }
        ]
      });

    return menuItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.isGroupChat, conversation?._id]);

  const socketUpdateConversation = (conversation: ConversationType) => {
    if (socket) socket.emit('update_conversation', conversation);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalChangeName(false);
  };

  // Handle group name change
  const handleSave = async () => {
    if (!newGroupName.trim() || newGroupName.trim() === conversation?.groupName) return;
    try {
      dispatch(setLoading(true));
      const response = await changeGroupName(conversation._id!, newGroupName);
      if (response?.success) {
        notifySuccess('Group name changed successfully');
        dispatch(updateConversationAction(response.data!));
        socketUpdateConversation(response.data!);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      notifyError('Failed to change group name');
    }
    setIsModalChangeName(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        notifyError('Only image files are allowed');
        return;
      }
      const base64 = await getBase64(file);
      setAvatar({ file: file, src: base64 || '' });
    }
  };

  const handleIconClick = () => {
    if (!loading) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };
  const handleUpdateGroupPhoto = async () => {
    try {
      if (avatar.src !== user?.avatar) {
        dispatch(setLoading(true));
        const formData = new FormData();
        formData.append('image', avatar.file || '');
        const response = await changeGroupAvatar(conversation._id!, formData);
        if (response?.success) {
          dispatch(setLoading(false));
          dispatch(updateConversationAction(response.data!));
          notifySuccess('Avatar updated successfully.');
          socketUpdateConversation(response.data!);
        }
      }
    } catch (error) {
      dispatch(setLoading(false));
      notifyError('Error updating avatar');
    }
  };
  const handleLeaveGroup = async () => {
    try {
      const response = await leaveGroupChat(conversation._id!);
      if (response?.success) {
        dispatch(removeConversation(response?.data?._id || ''));
        socketUpdateConversation(response.data!);
      }
    } catch (error) {
      notifyError('Failed to leave the group chat');
    }
  };
  useEffect(() => {
    setAvatar({
      ...avatar,
      src: conversation?.isGroupChat
        ? conversation?.groupAvatar || ''
        : conversation?.participants?.find((member) => member?._id !== user?._id)?.avatar || ''
    });
  }, [conversation?._id, conversation?.groupAvatar]);
  return (
    <div className="card flex h-full w-full flex-col overflow-x-hidden rounded-2xl border p-5 shadow-xl duration-200">
      <div className="flex h-full flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-5">
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <Avatar
            size={80}
            icon={conversation?.isGroupChat && !conversation?.groupAvatar && <HiOutlineUserGroup />}
            src={avatar?.src}
          />
          {avatar.src !== oldAvatar && (
            <div className="flex w-full items-center justify-center gap-5">
              <Tooltip title="Cancel">
                <Button
                  onClick={() => setAvatar({ src: oldAvatar || '', file: undefined })}
                  type="default"
                  shape="circle"
                  icon={<IoClose />}
                />
              </Tooltip>
              <Tooltip title="Accept">
                <Button
                  onClick={handleUpdateGroupPhoto}
                  type="primary"
                  disabled={avatar.src === user?.avatar}
                  shape="circle"
                  icon={<BsCheck />}
                />
              </Tooltip>
            </div>
          )}
          <div className="content flex flex-2 items-center justify-between">
            <div className="flex flex-col items-center justify-center">
              <Typography.Text strong className="text-[1.8rem]">
                {conversation?.isGroupChat
                  ? conversation?.groupName
                  : conversation?.participants?.find((member) => member?._id !== user?._id)?.username}
              </Typography.Text>
              <div className="flex gap-3">
                {conversation?.isGroupChat ? (
                  <Typography.Link className="text-[1.2rem]">
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
        <Menu
          className="flex-1 border-none"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          rootClassName="message-info-wrapper"
          mode="inline"
          items={items}
        />
        {conversation?.isGroupChat && (
          <div className="flex w-full">
            <Popconfirm title="Are you sure you want to leave this group?" onConfirm={handleLeaveGroup}>
              <Button icon={<IoExitOutline size={20} />} type="default" className="w-full text-[1.4rem]">
                Leave group
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>

      {/* Modal for changing group name */}
      <Modal
        title="Change Group Name"
        open={isModalChangeName}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter new group name"
        />
      </Modal>
    </div>
  );
};

export default MessageInformation;
