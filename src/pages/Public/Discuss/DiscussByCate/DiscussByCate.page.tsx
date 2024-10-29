import React from 'react';
import ListPostWithCategory from '../components/ListPostWithCategory/ListPostWithCategory';
import { useParams } from 'react-router-dom';

const DiscussByCate = () => {
  const { parentCateId } = useParams();
  return (
    <div>
      <ListPostWithCategory categoryId={parentCateId!} />
    </div>
  );
};

export default DiscussByCate;
