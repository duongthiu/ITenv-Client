import { Button, Divider, Drawer, Empty, Input, Pagination, PaginationProps, Skeleton } from 'antd';
import React, { memo, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import TagMenu from '../../../../../components/post/TagMenu/TagMenu.component';
import { getPostsWithCategoryId } from '../../../../../services/post/post.service';
import { CategoryType } from '../../../../../types/CategoryType';
import PostComponent from '../PostComponent/Post.component';
import CreatePostPage from '../../../../Private/CreatePostPage/CreatePostPage.page';
import './ListPostWithCategory.style.scss';
type ListPostWithCategoryProps = {
  categoryId: string;
  childCategories?: CategoryType[];
};
const ListPostWithCategory: React.FC<ListPostWithCategoryProps> = memo(({ categoryId }) => {
  const navigate = useNavigate();
  const { parentCateId } = useParams();
  const [openDrawer, setOpenDrawer] = useState(false);

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

  const { data: posts, isLoading } = useSWR(`/api/post/${categoryId}page=${currentPage}&limit=${pageSize}`, () =>
    getPostsWithCategoryId(categoryId, `page=${currentPage}&pageSize=${pageSize}&search=`)
  );
  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-10">
        {/* <div className="flex gap-40">
          {childCategories && childCategories?.length > 0 && (
            <Segmented
              size="large"
              className="w-fit"
              options={childCategories?.map((category) => category.name) || []}
              defaultValue={childCategories?.[0]?.name || ''}
            />
          )}
        </div> */}
      </div>

      <div className="flex gap-4">
        {isLoading && <Skeleton active className="h-full" />}
        <main className={`flex h-fit flex-1 flex-col ${posts?.data?.length !== 0 && 'card'}`}>
          <div className="flex items-center justify-between p-5 text-[1.4rem]">
            <div className="flex gap-5 text-[1.4rem]">
              <div>Hot</div>
            </div>
            <div className="flex gap-5">
              <Input className="w-fit min-w-[300px]" placeholder="Search posts..." />

              <Button
                onClick={() => showDrawer()}
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
          {posts?.data?.length === 0 ? (
            <div className="">
              <Empty className="" />
            </div>
          ) : (
            <div className="">
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
        <div className="card h-[400px] w-[250px] px-[10px]">
          <TagMenu selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>
      </div>
      <Drawer
        height={500}
        placement="bottom"
        size="default"
        rootClassName="listpost-drawer-wrapper"
        closable={true}
        onClose={onClose}
        open={openDrawer}
        key={categoryId}
      >
        <CreatePostPage />
      </Drawer>
    </div>
  );
});

export default ListPostWithCategory;
