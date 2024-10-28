import { Tabs } from 'antd';
import useSWR from 'swr';
import { getCategory } from '../../../services/post/post.service';
import ListPostWithCategory from './components/ListPostWithCategory/ListPostWithCategory';
import { useEffect, useMemo } from 'react';
import { CategoryType } from '../../../types/CategoryType';
import { useNavigate } from 'react-router-dom';

const DiscussPage = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading: isLoadingCate } = useSWR('category', getCategory);
  const tabItems = useMemo(() => {
    if (!categories?.data) return [];
    const parentCategories = categories?.data?.filter((category) => !category.parentCategory);

    const childCategoriesMap = categories?.data?.reduce((acc: Record<string, CategoryType[]>, category) => {
      if (category.parentCategory) {
        if (!acc[category.parentCategory]) {
          acc[category.parentCategory] = [];
        }
        acc[category.parentCategory].push(category);
      }
      return acc;
    }, {});
    return parentCategories.map((parentCategory) => ({
      key: parentCategory._id,
      label: parentCategory.name,
      value: parentCategory._id,
      children: (
        <ListPostWithCategory
          categoryId={parentCategory._id}
          childCategories={childCategoriesMap[parentCategory._id] || []}
        />
      )
    }));
  }, [categories]);
  useEffect(() => {
    navigate;
  }, []);
  return (
    <div className="mx-auto p-4">
      <header className="mb-8">
        <Tabs
          className="text-[1.6rem]"
          type="card"
          size="large"
          items={tabItems}
          defaultValue={categories?.data?.[0]?._id}
          defaultActiveKey={categories?.data?.[0]?._id}
        />
      </header>
    </div>
  );
};

export default DiscussPage;
