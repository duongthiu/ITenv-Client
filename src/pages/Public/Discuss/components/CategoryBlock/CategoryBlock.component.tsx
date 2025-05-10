import React from 'react';
import { CategoryType } from '../../../../../types/CategoryType';
import './CategoryBlock.style.scss';
type CategoryBlockProps = {
  category: CategoryType;
  isActive: boolean;
};

const CategoryBlock: React.FC<CategoryBlockProps> = ({ category, isActive }) => {
  return (
    <div
      className={`category-block sub-title card flex min-h-[100px] w-full cursor-pointer items-center justify-center rounded-lg border p-4 text-base shadow-md ${
        isActive ? 'active' : ''
      }`}
    >
      <h2 className="category-title text-primary mb-3 text-center font-semibold">{category.name}</h2>
    </div>
  );
};

export default CategoryBlock;
