import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Avatar, Divider, Skeleton, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import hljs from 'highlight.js';
import { useEffect, useMemo } from 'react';
import { CiBookmark, CiWarning } from 'react-icons/ci';
import { VscShare } from 'react-icons/vsc';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import PreviewTextEditorComponent from '../../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
import { openErrorModal } from '../../../../redux/app/app.slice';
import { useAppDispatch, useAppSelector } from '../../../../redux/app/hook';
import { getPostById, votePostById } from '../../../../services/post/post.service';
import ListCommentComponent from '../components/ListComment/ListComment.component';
import { TypeVoteEnum } from '../../../../types/enum/typeVote.enum';
const DetailDiscussPage = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { data: postData, isLoading, isError, mutate } = useSWR(`detailpost/${id}`, () => getPostById(id!));

  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [postData?.data?.content]);

  const handleVote = async (type: TypeVoteEnum) => {
    // if (!user) {
    //   dispatch(openErrorModal({ description: 'Please login to vote' }));
    //   return;
    // }
    try {
      const response = await votePostById(id!, type);
      if (response.success) {
        mutate();
      } else {
        dispatch(openErrorModal({ description: response.message }));
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const isVoted = useMemo(() => {
    if (user?._id) {
      if (postData?.data?.vote.includes(user?._id)) return true;
    }
    return false;
  }, [postData?.data?.vote, user?._id]);
  const isDownvoted = useMemo(() => {
    if (user?._id) {
      if (postData?.data?.downVote.includes(user?._id)) return true;
    }
    return false;
  }, [postData?.data?.downVote, user?._id]);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading the postData?.data.</p>;
  return (
    <div className="m-[10px] overflow-y-hidden rounded-lg shadow-lg">
      {isLoading && (
        <div className="skeleton-wrapper w-full p-10">
          <Skeleton active />
        </div>
      )}
      <div className="card overflow-y-auto">
        <div className="flex justify-between">
          <h1 className="text-[1.8rem] font-medium">{postData?.data?.title}</h1>
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
              onClick={() => handleVote(TypeVoteEnum.upvote)}
              className={`h-fit rounded-md text-[3rem] text-gray-500 hover:text-green-500 focus:outline-none focus:ring-green-500 ${isVoted && 'text-green-500'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Upvote"
            >
              <CaretUpOutlined />
            </motion.button>
            <p className="m-0 text-center text-[2rem] font-semibold">
              {(postData?.data?.vote.length || 0) - (postData?.data?.downVote.length || 0) > 0
                ? (postData?.data?.vote.length || 0) - (postData?.data?.downVote.length || 0)
                : 0}
            </p>
            <motion.button
              onClick={() => handleVote(TypeVoteEnum.downvote)}
              className={`rounded-md text-[3rem] text-gray-500 hover:text-red-500 focus:outline-none focus:ring-red-500 ${isDownvoted && 'text-red-500'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Downvote"
            >
              <CaretDownOutlined />
            </motion.button>
          </div>
          <div className="flex-auto">
            <div className="mb-4 flex items-center gap-4 text-[1.2rem]">
              <Avatar size={40} src={postData?.data?.postedBy?.avatar} />
              <div>
                <span className="mr-2 text-[1.4rem] font-semibold">{postData?.data?.postedBy?.username}</span>
                <span className="sub-title">{new Date(postData?.data?.createdAt || '').toLocaleString()}</span>
              </div>
            </div>
            <div className="prose mb-6 max-w-none">
              <PreviewTextEditorComponent content={postData?.data?.content} fontSize={1.4} />
            </div>
          </div>
        </div>

        <div className="mb-6">
          {postData?.data?.tags.map((tag: any) => (
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
          <ListCommentComponent postId={postData?.data?._id || ''} />
        </div>
      </div>
    </div>
  );
};

export default DetailDiscussPage;
