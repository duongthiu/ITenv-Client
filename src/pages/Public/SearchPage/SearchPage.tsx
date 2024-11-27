import { Empty, Pagination, PaginationProps, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSWR from 'swr';
import { useAppSelector } from '../../../redux/app/hook';
import { getAllUser } from '../../../services/user/user.service';
import { QueryOptions, ResponsePagination } from '../../../types/common';
import { UserType } from '../../../types/UserType';
import PersonCard from './components/PersonCard/PersonCard.component';

const PeopleSearch = () => {
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get('search');
  const [queryOptions, setQueryOptions] = useState<QueryOptions>({
    page: 1,
    pageSize: 10,
    search: searchParam || ''
  });

  const { user: userSelector } = useAppSelector((state) => state.user);
  const {
    data: userList,
    error,
    isLoading
  } = useSWR<ResponsePagination<UserType[]>>([`/api/users`, queryOptions], ([, options]) =>
    getAllUser(options as QueryOptions)
  );

  const onPaginationChange = (page: number, pageSize: number) => {
    setQueryOptions((prev) => ({ ...prev, page, pageSize }));
  };

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setQueryOptions((prev) => ({ ...prev, page: current, pageSize }));
  };

  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, search: searchParam || '' }));
  }, [searchParam]);

  if (isLoading) return <Spin spinning={isLoading} />;
  if (error) return <p>Error loading users</p>;

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto">
        {userList?.data?.length === 0 ? (
          <Empty />
        ) : (
          <div>
            <div className="grid grid-cols-5 gap-6">
              {userList?.data?.map(
                (user) => userSelector?._id !== user?._id && <PersonCard key={user._id} user={user} />
              )}
            </div>
            {/* Pagination */}
            <div className="mt-6 flex justify-end">
              <Pagination
                current={queryOptions.page}
                total={userList?.total || 0}
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                pageSize={queryOptions.pageSize}
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
