import React, { useState } from 'react';
import { Modal, Form, Input, Tabs, Button, Space, Table, Tag, message, Dropdown, Tooltip } from 'antd';
import { CodeSandboxType } from '../../../types/codesandbox.type';
import {
  getAccessRequests,
  deleteAccessRequest,
  updateCodeSandbox,
  handleAccessRequest as handleAccessRequestService,
  updateMemberRole,
  removeMember
} from '../../../services/codesanbox/codesandbox.service';
import useSWR from 'swr';
import { timeAgo } from '../../../utils/helpers/formatDate';
import { MoreOutlined } from '@ant-design/icons';

interface ManageSandboxModalProps {
  open: boolean;
  onClose: () => void;
  sandbox: CodeSandboxType;
  mutate: () => void;
}

const ManageSandboxModal: React.FC<ManageSandboxModalProps> = ({ open, onClose, sandbox, mutate }) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');

  const { data: accessRequests, mutate: mutateRequests } = useSWR(
    open ? `/api/codesandbox/${sandbox._id}/access-requests` : null,
    () => getAccessRequests(sandbox._id)
  );

  const handleUpdateSandbox = async (values: { name: string; description: string }) => {
    try {
      await updateCodeSandbox(sandbox._id, values);
      message.success('Sandbox updated successfully');
      mutate();
    } catch (error: any) {
      message.error(error.message || 'Failed to update sandbox');
    }
  };

  const handleAccessRequest = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await handleAccessRequestService(sandbox._id, requestId, action);
      message.success(`Request ${action}ed successfully`);
      mutateRequests();
    } catch (error: any) {
      message.error(error.message || `Failed to ${action} request`);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await deleteAccessRequest(sandbox._id, requestId);
      message.success('Request deleted successfully');
      mutateRequests();
    } catch (error: any) {
      message.error(error.message || 'Failed to delete request');
    }
  };

  const handleUpdateMemberRole = async (userId: string, role: 'owner' | 'editor' | 'viewer') => {
    try {
      await updateMemberRole(sandbox._id, userId, role);
      message.success(`Member role updated to ${role}`);
      mutate();
    } catch (error: any) {
      message.error(error.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember(sandbox._id, userId);
      message.success('Member removed successfully');
      mutate();
    } catch (error: any) {
      message.error(error.message || 'Failed to remove member');
    }
  };

  const memberColumns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => (
        <Space>
          <img src={user.avatar} alt={user.username} className="h-8 w-8 rounded-full" />
          <span>{user.username}</span>
        </Space>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'owner' ? 'red' : role === 'editor' ? 'blue' : 'green'}>{role.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Joined',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (date: string) => timeAgo(date)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'editor',
                label: 'Make Editor',
                onClick: () => handleUpdateMemberRole(record.user._id, 'editor')
              },
              {
                key: 'viewer',
                label: 'Make Viewer',
                onClick: () => handleUpdateMemberRole(record.user._id, 'viewer')
              },
              {
                key: 'remove',
                label: 'Remove Member',
                danger: true,
                onClick: () => handleRemoveMember(record.user._id)
              }
            ]
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  const requestColumns = [
    {
      title: 'User',
      dataIndex: 'requester',
      key: 'requester',
      render: (user: any) => (
        <Space>
          <img src={user.avatar} alt={user.username} className="h-8 w-8 rounded-full" />
          <span>{user.username}</span>
        </Space>
      )
    },
    {
      title: 'Requested Role',
      dataIndex: 'requestedRole',
      key: 'requestedRole',
      render: (role: string) => (
        <Tag color={role === 'owner' ? 'red' : role === 'editor' ? 'blue' : 'green'}>{role.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'pending' ? 'gold' : status === 'approved' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (message: string) => <Tooltip title={message}>{message}</Tooltip>
    },
    {
      title: 'Requested',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => timeAgo(date)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) =>
        record.status === 'pending' ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'approve',
                  label: 'Approve',
                  onClick: () => handleAccessRequest(record._id, 'approve')
                },
                {
                  key: 'reject',
                  label: 'Reject',
                  danger: true,
                  onClick: () => handleAccessRequest(record._id, 'reject')
                },
                {
                  key: 'delete',
                  label: 'Delete Request',
                  onClick: () => handleDeleteRequest(record._id)
                }
              ]
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        ) : null
    }
  ];

  const items = [
    {
      key: '1',
      label: 'General',
      children: (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: sandbox.name,
            description: sandbox.description,
            isPublic: sandbox.isPublic
          }}
          onFinish={handleUpdateSandbox}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter sandbox name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: '2',
      label: 'Members',
      children: (
        <Table
          columns={memberColumns}
          dataSource={sandbox.members}
          rowKey={(record) => record.user._id}
          pagination={false}
          scroll={{ x: 800 }}
        />
      )
    },
    {
      key: '3',
      label: 'Access Requests',
      children: (
        <Table
          scroll={{ x: 800 }}
          columns={requestColumns}
          dataSource={accessRequests?.data || []}
          rowKey="_id"
          pagination={false}
        />
      )
    }
  ];

  return (
    <Modal title="Manage Sandbox" open={open} onCancel={onClose} width={800} footer={null}>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </Modal>
  );
};

export default ManageSandboxModal;
