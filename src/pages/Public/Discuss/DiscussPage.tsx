import { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { paths } from '../../../routes/paths';
import { getCategory } from '../../../services/post/post.service';
import { CategoryType } from '../../../types/CategoryType';
import CategoryBlock from './components/CategoryBlock/CategoryBlock.component';
import { Skeleton } from 'antd';

const DiscussPage = () => {
  const { parentCateId } = useParams();

  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>(parentCateId || '');

  const { data: categories, isLoading: isLoadingCate } = useSWR('category', getCategory);
  const cates = useMemo(() => {
    if (!categories?.data) return [];

    const parentCategories = categories.data.filter((category) => !category.parentCategory);
    const childCategoriesMap = categories.data.reduce((acc: Record<string, CategoryType[]>, category) => {
      if (category.parentCategory) {
        if (!acc[category.parentCategory]) {
          acc[category.parentCategory] = [];
        }
        acc[category.parentCategory].push(category);
      }
      return acc;
    }, {});

    return parentCategories.map((parentCategory) => ({
      ...parentCategory,
      children: childCategoriesMap[parentCategory?._id || ''] || [] // Attach children if they exist
    }));
  }, [categories]);
  useEffect(() => {
    if (categories?.data?.length) {
      if (!parentCateId) {
        navigate(paths.parentCateDisCuss.replace(':parentCateId', categories?.data[0]?._id || ''));
        setActiveCategory(categories?.data[0]?._id || '');
      }
    }
  }, [categories]);

  return (
    <div className="mx-auto p-4">
      {isLoadingCate && <Skeleton.Node active />}
      <header className="">
        <div
          className={`grid w-full gap-x-5`}
          style={{ gridTemplateColumns: `repeat(${cates?.length || 1}, minmax(0, 1fr))` }}
        >
          {cates?.map((category) => (
            <div
              key={category._id}
              onClick={() => {
                setActiveCategory(category._id);
                navigate(paths.parentCateDisCuss.replace(':parentCateId', category._id));
              }}
            >
              <CategoryBlock isActive={category._id === activeCategory} key={category._id} category={category} />
            </div>
          ))}
        </div>
      </header>
      <Outlet context={cates} />
    </div>
  );
};

export default DiscussPage;
