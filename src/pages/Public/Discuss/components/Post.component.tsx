import React from 'react';
import { FaCode, FaImage, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { PostType } from '../../../../types/PostType';
import './Post.style.scss';
import { Avatar } from 'antd';
import { TiArrowUpOutline } from 'react-icons/ti';
import { FaRegEye } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa';
import { motion } from 'framer-motion';
type PostComponentProps = {
  post: PostType;
};

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} key={post._id} className="card mb-6 cursor-pointer">
      <div className="mb-4 flex items-center justify-between space-x-8">
        <div className="flex flex-1 justify-between">
          <div className="flex items-center space-x-4">
            {/* <img src={post.postBy.avatar} alt={post.postBy.username} className="h-10 w-10 rounded-full object-cover" /> */}
            <Avatar src={post.postBy.avatar} size={40} />
            <div>
              <h2 className="text-[1.6rem] font-medium">{post.title}</h2>
              <p className="sub-title text-[1.2rem]">
                Posted by {post.postBy.username} on {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center space-x-1">
            <TiArrowUpOutline size={22} />
            <span className="font-mono text-[2rem] font-semibold">{post.vote.length || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaRegEye size={22} />
            <span className="font-mono text-[2rem] font-semibold">{post.view.length || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaRegComment size={22} />
            <span className="font-mono text-[2rem] font-semibold">{post.vote.length || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostComponent;
