import { Button, Input, PaginationProps, Popconfirm, Table, Tag } from 'antd';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getAllPosts } from '../../../services/post/post.admin.service';
import { deletePostById } from '../../../services/post/post.service';
import { QueryOptions } from '../../../types/common';
import { PostType } from '../../../types/PostType';
import { notifyError, notifySuccess } from '../../../utils/helpers/notify';
import { useDebounce } from '../../../utils/hooks/useDebounce.hook';

const PostsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [queryOptions, setQueryOptions] = useState<QueryOptions>({
    page: 1,
    pageSize: 10,
    search: ''
  });

  const searchDebounce = useDebounce(searchTerm, 500);

  useEffect(() => {
    setQueryOptions((prev) => ({
      ...prev,
      search: searchDebounce
    }));
  }, [searchDebounce]);

  const { data, isLoading, mutate } = useSWR(`posts${JSON.stringify(queryOptions)}`, () => getAllPosts(queryOptions));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setQueryOptions((prev: any) => ({ ...prev, page: 1 }));
  };

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setQueryOptions({ ...queryOptions, page: current, pageSize });
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setQueryOptions({ ...queryOptions, page, pageSize });
  };

  const handleDeletePost = async (post: PostType) => {
    try {
      const response = await deletePostById(post._id);
      if (response.success) {
        notifySuccess('Post deleted successfully!');
        mutate();
      } else notifyError('Failed to delete the post. Please try again later.');
    } catch (error) {
      console.error('Error deleting post:', error);
      notifyError('Failed to delete the post. Please try again later.');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Posted By',
      dataIndex: 'postedBy',
      key: 'postedBy',
      render: (postedBy: { username: string }) => postedBy?.username || 'Anonymous'
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
    { title: 'Views', dataIndex: 'view', key: 'view', render: (view: string[]) => view.length },
    { title: 'Vote', dataIndex: 'vote', key: 'vote', render: (vote: string[]) => vote.length },
    { title: 'Down Vote', dataIndex: 'downVote', key: 'downvote', render: (downVote: string[]) => downVote.length },
    {
      title: 'Anonymous',
      dataIndex: 'isAnonymous',
      key: 'isAnonymous',
      render: (isAnonymous: boolean) => (isAnonymous ? 'Yes' : 'No')
    },
    { title: 'Resolved', dataIndex: 'resolve', key: 'resolve', render: (resolve: boolean) => (resolve ? 'Yes' : 'No') },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Status',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      render: (isDeleted: boolean) => <Tag color={isDeleted ? 'red' : 'green'}>{isDeleted ? 'Deleted' : 'Active'}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PostType) => (
        <div className="flex items-center gap-2">
          {!record?.isDeleted ? (
            <Popconfirm
              title="Are you sure to delete this post?"
              onConfirm={() => handleDeletePost(record)} // Pass record to delete function
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                icon={<Trash2 size={18} />}
                className="text-red-400 hover:text-red-300"
                aria-label="Delete post"
              />
            </Popconfirm>
          ) : (
            <Tag color={'green'}></Tag>
          )}
        </div>
      )
    }
  ];

  return (
    <motion.div
      className="box mb-8 rounded-xl bg-opacity-50 p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="sub-title text-[1.6rem] font-semibold">Posts List</h2>
        <Input
          type="text"
          placeholder="Search posts..."
          className="w-[300px] rounded-lg px-5 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
          prefix={<Search className="text-gray-400" size={18} />}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="_id"
        className="bg-opacity-50"
        loading={isLoading}
        pagination={{
          current: queryOptions.page || 1,
          total: data?.total || 0,
          showSizeChanger: true,
          pageSize: queryOptions.pageSize,
          onChange: onPaginationChange,
          onShowSizeChange: onShowSizeChange
        }}
      />
    </motion.div>
  );
};

export default PostsTable;
