import { Empty, Input, Spin, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import useSWR from 'swr';
import { getAllUser, UserPageType } from '../../../services/user/user.admin.service';
import { formatDate } from '../../../utils/helpers/formatDate';

// Define the types for the user data (adjust as needed)
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastOnline: Date;
};

const UsersTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(''); // Type searchTerm as string
  const [queryOptions, setQueryOptions] = useState({ page: 1, pageSize: 10, search: '' });

  // Use SWR to fetch data
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: isErrorUsers
  } = useSWR('users' + JSON.stringify(queryOptions), () => getAllUser(queryOptions));

  // Handle the search input and update queryOptions
  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setQueryOptions((prev) => ({
      ...prev,
      search: term
    }));
  };

  // Columns for Ant Design Table
  const columns: ColumnsType<UserPageType> = [
    {
      title: 'Name',
      dataIndex: ['user', 'username'], // Accessing nested user object
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
      render: (role) => <Tag color={role === 'ADMIN' ? 'purple' : 'green'}>{role}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status ? 'green' : 'red'}>{status ? 'Online' : 'Offline'}</Tag>
    },
    {
      title: 'Last Online',
      dataIndex: ['user', 'lastOnline'], // Accessing nested user object
      key: 'lastOnline',
      render: (date) => <span>{new Date(date).toLocaleString()}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <button className="mr-2 text-indigo-400 hover:text-indigo-300">Edit</button>
          <button className="text-red-400 hover:text-red-300">Delete</button>
        </>
      )
    }
  ];

  const filteredUsers = usersData?.data || [];

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

      {/* Handle Loading, Error, and Empty States */}
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
        <Table columns={columns} dataSource={filteredUsers} rowKey="_id" pagination={{ pageSize: 5 }} />
      )}
    </motion.div>
  );
};

export default UsersTable;
