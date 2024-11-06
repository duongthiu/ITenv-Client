import { Empty, Pagination, Spin } from 'antd';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useSWR from 'swr';
import { getAllUser } from '../../../services/user/user.service';
import { ResponsePagination } from '../../../types/common';
import { UserType } from '../../../types/UserType';
import PersonCard from './components/PersonCard/PersonCard.component';

const PeopleSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const search = useLocation().search;
  const q = new URLSearchParams(search).get('q') || '';

  const {
    data: userList,
    error,
    isLoading
  } = useSWR<ResponsePagination<UserType[]>>(`/api/users?page=${currentPage}&limit=${pageSize}&q=${q}`, () =>
    getAllUser(`page=${currentPage}&limit=${pageSize}${q ? `&q=${q}` : ''}`)
  );

  const onPaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) return <Spin spinning={isLoading} />;
  if (error) return <p>Error loading users</p>;

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto">
        {userList?.data?.length === 0 ? (
          <Empty />
        ) : (
          <div>
            <div className="grid grid-cols-4 gap-6">
              {userList?.data?.map((user) => <PersonCard key={user._id} user={user} />)}
            </div>
            {/* Pagination */}
            <div className="mt-6 flex justify-end">
              <Pagination
                current={currentPage}
                total={userList?.total || 0}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  setCurrentPage(current);
                  setPageSize(pageSize);
                }}
                pageSize={pageSize}
                onChange={onPaginationChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleSearch;
