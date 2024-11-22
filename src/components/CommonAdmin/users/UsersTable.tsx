import { Button, Empty, Input, PaginationProps, Select, Spin, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { editUserRole, getAllUser, UserPageType } from '../../../services/user/user.admin.service'; // Add updateUserRole
import { formatDate } from '../../../utils/helpers/formatDate';
import { useDebounce } from '../../../utils/hooks/useDebounce.hook';
import { notifySuccess } from '../../../utils/helpers/notify';

const { Option } = Select;

const UsersTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [queryOptions, setQueryOptions] = useState({ page: 1, pageSize: 10, search: '' });
  const searchDebounce = useDebounce(searchTerm, 500);

  const [editingRowId, setEditingRowId] = useState<string | null>(null); // Track editing row
  const [selectedRole, setSelectedRole] = useState<string>(''); // Track selected role during edit

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: isErrorUsers,
    mutate
  } = useSWR('users' + JSON.stringify(queryOptions), () => getAllUser(queryOptions));

  // Handle search input changes
  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    setQueryOptions((prev) => ({
      ...prev,
      search: searchDebounce
    }));
  }, [searchDebounce]);

  const handleEditClick = (record: UserPageType) => {
    setEditingRowId(record.user?._id);
    setSelectedRole(record.user.role); // Set initial role for the dropdown
  };
  // Handle Confirm button click
  const handleConfirmClick = async (userId: string) => {
    try {
      if (userId && editingRowId) {
        console.log(userId, selectedRole);
        const result = await editUserRole(userId, selectedRole);
        if (result.success) {
          notifySuccess('Role updated successfully');
          mutate();
        } else {
          notifySuccess('Fail to update role');
        }
      }
      setEditingRowId(null); // Exit editing mode
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  // Handle Cancel button click
  const handleCancelClick = () => {
    setEditingRowId(null);
    setSelectedRole(''); // Reset selected role
  };

  // Table Columns
  const columns: ColumnsType<UserPageType> = [
    {
      title: 'Name',
      dataIndex: ['user', 'username'],
      key: 'name',
      render: (text) => <span className="sub-title">{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span className="sub-title">{text}</span>
    },
    {
      title: 'Gender',
      dataIndex: ['user', 'gender'],
      key: 'gender',
      render: (text) => (text ? <span className="sub-title">{text}</span> : <Tag color="green"></Tag>)
    },
    {
      title: 'BirthDay',
      dataIndex: ['user', 'dob'],
      key: 'dob',
      render: (text) => (text ? <span className="sub-title">{formatDate(text)}</span> : <Tag color="green"></Tag>)
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) =>
        editingRowId === record?.user?._id ? (
          <Select
            defaultValue={record.user.role}
            value={selectedRole}
            onChange={(value) => setSelectedRole(value)}
            className="w-full"
          >
            <Option value="ADMIN">ADMIN</Option>
            <Option value="USER">USER</Option>
          </Select>
        ) : (
          <Tag color={role === 'ADMIN' ? 'purple' : 'green'}>{role}</Tag>
        )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status ? 'green' : 'red'}>{status ? 'Online' : 'Offline'}</Tag>
    },
    {
      title: 'Last Online',
      dataIndex: ['user', 'lastOnline'],
      key: 'lastOnline',
      render: (date) => <span>{new Date(date).toLocaleString()}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) =>
        editingRowId === record?.user?._id ? (
          <div className="flex items-center gap-2">
            <Button type="primary" onClick={() => handleConfirmClick(record?.user?._id)}>
              Confirm
            </Button>
            <Button onClick={handleCancelClick}>Cancel</Button>
          </div>
        ) : (
          <Button onClick={() => handleEditClick(record)} className="text-blue-500">
            Edit
          </Button>
        )
    }
  ];

  const filteredUsers = usersData?.data || [];
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setQueryOptions({ ...queryOptions, page: current, pageSize });
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setQueryOptions({ ...queryOptions, page, pageSize });
  };

  return (
    <motion.div
      className="box rounded-xl bg-opacity-50 p-6 shadow-lg backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="sub-title text-[1.6rem] font-semibold">Users</h2>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search users..."
            className="w-[300px] rounded-lg px-5 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
            prefix={<Search className="text-gray-400" size={18} />}
          />
        </div>
      </div>

      {isLoadingUsers ? (
        <div className="flex items-center justify-center py-8">
          <Spin />
        </div>
      ) : isErrorUsers ? (
        <div className="flex items-center justify-center py-8">
          <span className="text-red-500">Failed to load users. Please try again later.</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Empty description="No users found" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          pagination={{
            current: queryOptions.page || 1,
            total: usersData?.total || 0,
            showSizeChanger: true,
            pageSize: queryOptions.pageSize,
            onChange: onPaginationChange,
            onShowSizeChange: onShowSizeChange
          }}
        />
      )}
    </motion.div>
  );
};

export default UsersTable;
