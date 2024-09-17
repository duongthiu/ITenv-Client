import React from 'react';
import { PostType } from '../../../../types/PostType';
import { Avatar, Typography } from 'antd';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import './Post.style.scss';
type PostComponentProps = {
  post: PostType;
};
const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  return (
    <div className="mb-5 flex">
      <Avatar src={post.image_url} size={40} className="self-end" />
      <div className="post-wrapper relative ml-[20px] w-full rounded-md border-[1px] p-5">
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center">
            <AiOutlineLike size={16} />
            <Typography.Text strong className="text-[1.8rem]">
              {post?.vote}
            </Typography.Text>
            <AiOutlineDislike size={16} />
          </div>
          <div className="flex flex-col gap-2">
            <Typography.Text strong>{post?.title}</Typography.Text>
            <Typography.Text>{post?.content}</Typography.Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
