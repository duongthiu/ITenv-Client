import React, { useState } from 'react';
import useSWR from 'swr';
import { ResponsePagination } from '../../../types/common';
import { UserType } from '../../../types/UserType';
import { getAllUser } from '../../../services/user/user.service';
import { Pagination, PaginationProps } from 'antd';
import { useLocation, useParams } from 'react-router-dom';

const SearchPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const search = useLocation().search;
  const q = new URLSearchParams(search).get('q');

  const {
    data: userList,
    error,
    isLoading
  } = useSWR<ResponsePagination<UserType[]>>(`/api/users?page=${currentPage}&limit=${pageSize}&q=${q}`, () =>
    getAllUser(`page=${currentPage}&limit=${pageSize}${q ? `&q=${q}` : ''}`)
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page); // Update current page
    setPageSize(pageSize); // Optionally update page size if needed
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">User List</h1>

      <ul className="space-y-4">
        {userList?.data?.map((user) => (
          <li key={user.username} className="user-item card flex items-center rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="text-[1.4rem] font-semibold">
                  {user.username} - {user.email}
                </p>
                <p className="text-[1rem]">
                  Status:{' '}
                  {user.status === 1 ? (
                    <span className="font-semibold text-green-600">Online</span>
                  ) : (
                    <span className="font-semibold text-red-600">
                      {user?.lastOnline
                        ? `Offline - Last online at ${new Date(user.lastOnline).toLocaleString()}`
                        : 'Offline'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end">
        <Pagination
          current={currentPage}
          total={userList?.total || 0}
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          pageSize={pageSize}
          onChange={onPaginationChange}
        />
      </div>
    </div>
  );
};

export default SearchPage;
