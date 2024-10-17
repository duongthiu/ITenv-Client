import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Avatar, Divider, Skeleton, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import hljs from 'highlight.js';
import { useEffect, useState } from 'react';
import { CiBookmark, CiWarning } from 'react-icons/ci';
import { VscShare } from 'react-icons/vsc';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import PreviewTextEditorComponent from '../../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
import { useAppSelector } from '../../../../redux/app/hook';
import { getPostById } from '../../../../services/post/post.service';
import { PostType } from '../../../../types/PostType';
import ListCommentComponent from '../components/ListComment/ListComment.component';
const DetailDiscussPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isVoting, setIsVoting] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const { data: postData, isLoading, isError } = useSWR('detailpost/' + id, () => getPostById(id!));
  const [post, setPost] = useState<PostType | null>(postData?.data || null);

  useEffect(() => {
    if (postData?.data) {
      setPost(postData.data);
    }
  }, [postData]);

  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [post?.content]);

  const handleVote = async (type: 'up' | 'down') => {
    if (!user) return;
    setIsVoting(true);
    try {
      const updatedVotes =
        type === 'up'
          ? [...(post?.vote || []), user._id]
          : (post?.vote || []).filter((voterId) => voterId !== user._id);

      setPost((prevPost) => (prevPost ? { ...prevPost, vote: updatedVotes } : prevPost));
      // Make an API call here to update the vote count in the backend
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  // const handleCommentSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!newComment.trim()) return;
  //   if (!post) return;

  //   const newCommentObj = {
  //     _id: String(post.commentBy.length + 1),
  //     commentBy: {
  //       _id: user?._id,
  //       username: user?.username,
  //       avatar: user?.avatar
  //     },
  //     content: newComment.trim(),
  //     isAccepted: false,
  //     createdAt: new Date().toISOString(),
  //     vote: []
  //   };

  //   setPost((prevPost) => (prevPost ? { ...prevPost, commentBy: [...prevPost.commentBy, newCommentObj] } : prevPost));
  //   setNewComment('');
  //   // Make an API call here to submit the comment to the backend
  // };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading the post.</p>;

  return (
    <div className="m-[10px] overflow-y-hidden rounded-lg shadow-lg">
      {isLoading && (
        <div className="skeleton-wrapper w-full p-10">
          <Skeleton active />
        </div>
      )}
      <div className="card overflow-y-auto">
        <div className="flex justify-between">
          <h1 className="text-[1.8rem] font-medium">{post?.title}</h1>
          <div className="flex items-center gap-10 text-[1.4rem]">
            <Tooltip title="Report">
              <button className="flex items-center hover:text-red-500">
                <CiWarning size={25} />
              </button>
            </Tooltip>
            <Tooltip title="Save">
              <button className="flex items-center hover:text-yellow-500">
                <CiBookmark size={25} />
              </button>
            </Tooltip>
            <Tooltip title="Share">
              <button className="flex items-center hover:text-blue-500">
                <VscShare size={25} />
              </button>
            </Tooltip>
          </div>
        </div>
        <Divider className="my-[15px]" />
        <div className="flex gap-12">
          <div className="ml-8 flex flex-none flex-col items-center">
            <motion.button
              onClick={() => handleVote('up')}
              className={`h-fit rounded-md text-[3rem] text-gray-500 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 ${isVoting ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={isVoting}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Upvote"
            >
              <CaretUpOutlined />
            </motion.button>
            <p className="m-0 text-center text-[2rem] font-semibold">{post?.vote.length}</p>
            <motion.button
              onClick={() => handleVote('down')}
              className={`rounded-md text-[3rem] text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 ${isVoting ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={isVoting}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Downvote"
            >
              <CaretDownOutlined />
            </motion.button>
          </div>
          <div className="flex-auto">
            <div className="mb-4 flex items-center gap-4 text-[1.2rem]">
              <Avatar size={40} src={post?.postedBy?.avatar} />
              <div>
                <span className="mr-2 text-[1.4rem] font-semibold">{post?.postedBy?.username}</span>
                <span className="sub-title">{new Date(post?.createdAt || '').toLocaleString()}</span>
              </div>
            </div>
            <div className="prose mb-6 max-w-none">
              <PreviewTextEditorComponent content={post?.content} fontSize={1.4} />
            </div>
          </div>
        </div>

        <div className="mb-6">
          {post?.tags.map((tag) => (
            <span
              key={tag._id}
              className="tag mb-2 mr-2 inline-block rounded-full px-5 py-2 text-[1.2rem] font-semibold"
            >
              #{tag.name}
            </span>
          ))}
        </div>
        <div className="border-t pt-6">
          <h2 className="mb-4 text-2xl font-bold">Comments</h2>
          <ListCommentComponent postId={post?._id} />
        </div>
      </div>
    </div>
  );
};

export default DetailDiscussPage;
