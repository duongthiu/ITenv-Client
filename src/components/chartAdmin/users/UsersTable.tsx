import { useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Table, Tag, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// Define the types for the user data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastOnline: Date;
}

const userData: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Customer',
    status: 'Active',
    lastOnline: new Date('2024-11-07T04:11:04.862+00:00')
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Admin',
    status: 'Active',
    lastOnline: new Date('2024-11-07T04:11:04.862+00:00')
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Customer',
    status: 'Inactive',
    lastOnline: new Date('2024-11-07T04:11:04.862+00:00')
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Customer',
    status: 'Active',
    lastOnline: new Date('2024-11-07T04:11:04.862+00:00')
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'Moderator',
    status: 'Active',
    lastOnline: new Date('2024-11-07T04:11:04.862+00:00')
  }
];

const UsersTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(''); // Type searchTerm as string
  const [filteredUsers, setFilteredUsers] = useState<User[]>(userData); // Type filteredUsers as User[]

  // Handle the search input
  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = userData.filter(
      (user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  // Define columns for the Ant Design Table
  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
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
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'Admin' ? 'geekblue' : role === 'Moderator' ? 'purple' : 'green'}>{role}</Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
    },
    {
      title: 'Last Online',
      dataIndex: 'lastOnline',
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
      <Table columns={columns} dataSource={filteredUsers} rowKey="id" pagination={{ pageSize: 5 }} />
    </motion.div>
  );
};

export default UsersTable;
