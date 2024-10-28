import { Avatar } from 'antd';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { FaCaretDown, FaCaretUp, FaComment, FaEye } from 'react-icons/fa';
import { PostType } from '../../../../../types/PostType';
import './Post.style.scss';
import { AnonymousIcon } from '../../../../../utils/icons/Anonymous.icon';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../../redux/app/hook';
type PostComponentProps = {
  post: PostType;
};

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  const isVoted = useMemo(() => {
    if (user?._id) {
      if (post?.vote?.includes(user?._id)) return true;
    }
    return false;
  }, [post?.vote, user?._id]);
  const isDownvoted = useMemo(() => {
    if (user?._id) {
      if (post?.downVote?.includes(user?._id)) return true;
    }
    return false;
  }, [post?.downVote, user?._id]);
  const totalVote = useMemo(() => {
    return (post?.vote?.length || 0) - (post?.downVote?.length || 0) > 0
      ? (post?.vote?.length || 0) - (post?.downVote?.length || 0)
      : 0;
  }, [post?.vote?.length, post?.downVote?.length]);
  return (
    <motion.div
      key={post._id}
      className="group mb-6 cursor-pointer border-b-[1px] p-3"
      onClick={() => navigate(`/discuss/${post?._id}`)}
    >
      <div className="flex items-center justify-between space-x-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center space-x-4">
            {post?.postedBy?.avatar ? (
              <Avatar src={post?.postedBy?.avatar} size={40} />
            ) : (
              <Avatar icon={<AnonymousIcon />} />
            )}

            <div>
              <div className="flex items-center gap-5">
                <h2 className="text-[1.6rem] font-medium duration-200 group-hover:text-primary-color">{post.title}</h2>{' '}
                <div className="flex flex-wrap">
                  {post?.tags?.map((tag) => (
                    <span key={tag._id} className="tag mb-2 mr-2 rounded px-2.5 py-0.5 text-[1rem] font-medium">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <p className="sub-title text-[1.2rem] group-hover:text-primary-color">
                Posted by {post?.postedBy?.username || 'Anonymous'} on {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8 text-[1rem]">
              <div className="flex items-center space-x-2">
                {isDownvoted ? (
                  <FaCaretDown className={` ${isDownvoted ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                ) : (
                  <FaCaretUp className={` ${isVoted ? 'text-green-500' : 'text-gray-500'}`} size={18} />
                )}
                <span>
                  {totalVote} {totalVote > 1 ? 'votes' : 'vote'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEye className={`'text-gray-500'}`} size={18} />
                <span>{post?.view?.length} views</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaComment className="text-gray-500" size={18} />
                <span>
                  {post?.commentBy?.length} {post?.commentBy?.length > 1 ? 'comments' : 'comment'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostComponent;
