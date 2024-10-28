import { Button, Divider, Empty, Input, Pagination, PaginationProps, Segmented, Skeleton } from 'antd';
import React, { memo, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import TagMenu from '../../../../../components/post/TagMenu/TagMenu.component';
import { paths } from '../../../../../routes/paths';
import { getPostsWithCategoryId } from '../../../../../services/post/post.service';
import { CategoryType } from '../../../../../types/CategoryType';
import PostComponent from '../PostComponent/Post.component';
type ListPostWithCategoryProps = {
  categoryId: string;
  childCategories?: CategoryType[];
};
const ListPostWithCategory: React.FC<ListPostWithCategoryProps> = memo(({ categoryId, childCategories }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };
  const onPaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page); // Update current page
    setPageSize(pageSize); // Optionally update page size if needed
  };

  const {
    data: posts,
    isLoading,
    error
  } = useSWR(`/api/post/${categoryId}page=${currentPage}&limit=${pageSize}`, () =>
    getPostsWithCategoryId(categoryId, `page=${currentPage}&pageSize=${pageSize}&search=${search}`)
    );
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-10">
        <div className="flex gap-40">
          {childCategories && childCategories?.length > 0 && (
            <Segmented
              size="large"
              className="w-fit"
              options={childCategories?.map((category) => category.name) || []}
              defaultValue={childCategories?.[0]?.name || ''}
            />
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {isLoading && <Skeleton active className="h-full" />}
        <main className="flex h-fit flex-1 flex-col">
          {posts?.data?.length === 0 ? (
            <div className="">
              <Empty className="" />
            </div>
          ) : (
            <div className="card">
              <div className="flex items-center justify-between text-[1.4rem]">
                <div className="flex gap-5 text-[1.4rem]">
                  <div>Hot</div>
                </div>
                <div className="flex gap-5">
                  <Input className="w-fit min-w-[300px]" placeholder="Search posts..." />
                  <Button
                    onClick={() => navigate(paths.createPost)}
                    iconPosition="end"
                    type="primary"
                    className="bg-primary-success-700 hover:bg-primary-success-500"
                    icon={<FiSend size={20} />}
                  >
                    New
                  </Button>
                </div>
              </div>
              <Divider className="my-[15px]" />
              <div className="flex-1">{posts?.data?.map((post) => <PostComponent key={post._id} post={post} />)} </div>

              <div className="flex w-full items-center justify-center">
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
          )}
        </main>
        <div className="card h-[500px] w-[350px]">
          <TagMenu selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>
      </div>
    </div>
  );
});

export default ListPostWithCategory;
