import { Button, Input, Table, Dropdown, Menu } from 'antd';
import { motion } from 'framer-motion';
import { Eye, MoreVertical, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { getProblems } from '../../../services/problem/problem.service';
import { QueryOptions } from '../../../types/common';
import { useDebounce } from '../../../utils/hooks/useDebounce.hook';

const ProblemsTable: React.FC = () => {
  const [queryOptions, setQueryOptions] = useState<QueryOptions>({ page: 1, pageSize: 10, search: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const searchDebounce = useDebounce(searchTerm, 500);
  const navigate = useNavigate();
  const { data: problemData, isLoading } = useSWR('problemData' + JSON.stringify(queryOptions), () =>
    getProblems(queryOptions)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleMenuClick = (record: any, key: string) => {
    if (key === 'view') {
      navigate(`/admin/problems/${record.questionId}`);
    } else if (key === 'edit') {
      navigate(`/admin/problems/${record.questionId}/edit`);
    }
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="sub-title text-[1.4rem]">{text}</span>
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text: string) => <span className="sub-title">{text}</span>
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (text: string) => <span className={`text-gray-100 ${getDifficultyColor(text)}`}>{text}</span>
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: { name: string }[]) => (
        <div className="flex flex-wrap">
          {tags?.map((tag) => (
            <span key={tag.name} className="tag mb-2 mr-2 rounded px-2.5 py-0.5 text-[1rem] font-medium">
              {tag.name}
            </span>
          ))}
        </div>
      )
    },
    {
      title: 'Posted At',
      dataIndex: 'postAt',
      key: 'postAt',
      render: (text: Date) => <span className="sub-title">{new Date(text).toLocaleDateString()}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => handleMenuClick(record, key)}>
              <Menu.Item key="view" icon={<Eye size={16} />}>
                View
              </Menu.Item>
              <Menu.Item key="edit" icon={<Eye size={16} />}>
                Edit
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreVertical size={18} />} />
        </Dropdown>
      )
    }
  ];

  // Filter problems based on the search term
  useEffect(() => {
    setQueryOptions({ ...queryOptions, search: searchDebounce });
  }, [searchDebounce]);

  return (
    <motion.div
      className="box rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <h2 className="sub-title text-[1.6rem] font-semibold">Problem List</h2>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search posts..."
              className="w-[300px] rounded-lg px-5 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
              prefix={<Search className="text-gray-400" size={18} />}
            />
          </div>
        </div>
        <Button type="primary" onClick={() => navigate('/admin/problems/create')}>
          Add Problem
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={problemData?.data || []}
          rowKey="questionId"
          loading={isLoading}
          pagination={{
            current: queryOptions.page,
            pageSize: queryOptions.pageSize,
            total: problemData?.total || 0,
            onChange: (page, pageSize) => setQueryOptions({ ...queryOptions, page, pageSize })
          }}
        />
      </div>
    </motion.div>
  );
};

export default ProblemsTable;
