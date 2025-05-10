import { Button, Divider, Drawer, Empty, Input, Pagination, PaginationProps, Segmented, Skeleton } from 'antd';
import { motion } from 'framer-motion';
import React, { memo, useEffect, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import useSWR from 'swr';
import TagMenu from '../../../../../components/post/TagMenu/TagMenu.component';
import { getPostsWithCategoryId } from '../../../../../services/post/post.service';
import { QueryOptions } from '../../../../../types/common';
import { useDebounce } from '../../../../../utils/hooks/useDebounce.hook';
import CreatePostPage from '../../../../Private/CreatePostPage/CreatePostPage.page';
import PostComponent from '../PostComponent/Post.component';
import './ListPostWithCategory.style.scss';
type ListPostWithCategoryProps = {
  categoryId: string;
};
const ListPostWithCategory: React.FC<ListPostWithCategoryProps> = memo(({ categoryId }) => {
  // const navigate = useNavigate();
  // const { parentCateId } = useParams();
  const [openDrawer, setOpenDrawer] = useState(false);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [queryOption, setQueryOption] = useState<QueryOptions>({
    page: 1,
    pageSize: 10,
    sortField: 'VIEWS',
    sortOrder: 'DESC',
    search: search,
    tags: []
  });
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setQueryOption({ ...queryOption, page: current });
  };
  const onPaginationChange = (page: number, pageSize: number) => {
    setQueryOption({ ...queryOption, page: page, pageSize: pageSize });
  };

  const { data: posts, isLoading } = useSWR(`list-posts-${categoryId}-${JSON.stringify(queryOption)}`, () =>
    getPostsWithCategoryId(categoryId, queryOption)
  );
  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };
  // const childCategories = cates.map((cate) => (cate._id === parentCateId ? cate.children : [])).flat();
  const sortMenu = [
    {
      name: 'Hot',
      key: 'VIEWS'
    },
    {
      name: 'Newest to Oldest',
      key: 'createdAt'
    },
    {
      name: 'Most Votes',
      key: 'VOTES'
    }
  ];
  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  const handleSortChange = (value: string) => {
    const selectedSortKey = sortMenu.find((menu) => menu.name === value)?.key || 'VIEWS'; // Default to 'VIEWS'
    setQueryOption((prev) => ({ ...prev, sortField: selectedSortKey }));
  };
  useEffect(() => {
    setQueryOption((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);
  useEffect(() => {
    setQueryOption({ ...queryOption, tags: [...selectedTags] });
  }, [selectedTags]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2"></div>

      <div className="flex gap-4">
        <main className={`flex h-fit flex-1 flex-col space-y-4 ${posts?.data?.length !== 0 && 'card'}`}>
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
          <div></div>
          <div className="flex items-center justify-between p-5 text-sm">
            <div className="flex gap-5 text-sm">
              <Segmented
                onChange={handleSortChange}
                size="large"
                className="w-fit"
                options={sortMenu.map((menu) => menu.name)}
              />
            </div>
            <div className="flex gap-5">
              <Input
                onChange={(e) => setSearch(e.target.value)}
                className="w-fit min-w-[300px]"
                placeholder="Search posts..."
              />

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
            <motion.div
              className="flex-1"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {isLoading ? (
                <Skeleton active className="h-full" />
              ) : (
                posts?.data?.map((post) => <PostComponent key={post._id} post={post} />)
              )}
            </motion.div>
          )}
          <div className="flex w-full items-center justify-center">
            <Pagination
              current={queryOption?.page}
              total={posts?.total || 0}
              showSizeChanger
              onShowSizeChange={onShowSizeChange}
              pageSize={queryOption?.pageSize}
              onChange={onPaginationChange}
            />
          </div>
        </main>
        <div className="card h-[400px] w-[250px] px-[10px]">
          <TagMenu selectedTags={queryOption.tags || []} setSelectedTags={setSelectedTags} />
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
