import { Pagination, PaginationProps, Typography } from 'antd';
import { ChangeEvent, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useSWR from 'swr';
import { getPostsWithCategoryId } from '../../../services/post/post.service';
import LoadingPage from '../../commons/LoadingPage';
import PostComponent from './components/Post.component';

const DiscussPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popularity' | 'recent'>('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const categoryId = '670b6a1062937ef087fd23ba';
  const {
    data: posts,
    isLoading,
    error
  } = useSWR(`/api/post/page=${currentPage}&limit=${pageSize}`, () =>
    getPostsWithCategoryId(categoryId, `page=${currentPage}&pageSize=${pageSize}`)
  );
  console.log(posts);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (criteria: 'popularity' | 'recent') => {
    setSortBy(criteria);
  };
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    console.log(current, pageSize);
    setCurrentPage(current);
    setPageSize(pageSize);
  };
  const onPaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page); // Update current page
    setPageSize(pageSize); // Optionally update page size if needed
  };

  return (
    <div className="mx-auto p-4">
      <header className="mb-8">
        {isLoading && <LoadingPage />}
        <div className="card mb-8">
          <Typography.Title level={3} className="font-mono">
            Discuss
          </Typography.Title>
          <div className="flex items-center justify-between">
            <div className="relative mr-4 flex-grow">
              <input
                type="text"
                placeholder="Search discussions..."
                className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearch}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <button
                className={`rounded-lg px-4 py-2 ${
                  sortBy === 'popularity' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleSort('popularity')}
              >
                Popular
              </button>
              <button
                className={`rounded-lg px-4 py-2 ${
                  sortBy === 'recent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleSort('recent')}
              >
                Recent
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>{posts?.data?.map((post) => <PostComponent key={post._id} post={post} />)}</main>
      <div className="card my-5 flex h-[50px] w-full items-center justify-center">
        <Pagination
          current={currentPage}
          total={posts?.total || 0}
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          pageSize={pageSize}
          onChange={onPaginationChange}
        />
      </div>
    </div>
  );
};

export default DiscussPage;
