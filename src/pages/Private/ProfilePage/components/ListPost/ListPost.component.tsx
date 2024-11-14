import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { getPostByUserId } from '../../../../../services/post/post.service';
import { QueryOptions } from '../../../../../types/common';
import { Empty, Pagination, PaginationProps, Skeleton } from 'antd';
import PostComponent from '../../../../Public/Discuss/components/PostComponent/Post.component';
import { useAppSelector } from '../../../../../redux/app/hook';

type ListPostProps = {
  userId: string;
};

const ListPost: React.FC<ListPostProps> = ({ userId }) => {
  const { user: userSelector } = useAppSelector((state) => state.user);
  const isOwnProfile = useMemo(() => userSelector?._id === userId, [userSelector?._id, userId]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryOptions, setQueryOptions] = useState<QueryOptions>({ page: 1, pageSize: 10 });

  const { data: listPosts, isLoading } = useSWR(`listPosts ${userId}- ${JSON.stringify(queryOptions)}`, () =>
    getPostByUserId(userId, queryOptions)
  );

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, size) => {
    setCurrentPage(current);
    setPageSize(size);
    setQueryOptions({ page: current, pageSize: size });
  };

  const onPaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    setQueryOptions({ page, pageSize: size });
  };

  return (
    <div>
      {isLoading && <Skeleton avatar paragraph={{ rows: 4 }} active className="py-5" />}
      {listPosts?.data?.length === 0 ? (
        <Empty />
      ) : (
        <div>
          <div className="flex-1">
            {listPosts?.data?.map((post) => {
              if (post?.isAnonymous && !isOwnProfile) return null;
              return <PostComponent key={post._id} post={post} />;
            })}
          </div>
          {listPosts?.total ||
            (0 > pageSize && (
              <div className="flex w-full items-center justify-center">
                <Pagination
                  current={currentPage}
                  total={listPosts?.total || 0}
                  showSizeChanger
                  pageSize={pageSize}
                  onShowSizeChange={onShowSizeChange}
                  onChange={onPaginationChange}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ListPost;
