import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, message, Popconfirm, Skeleton, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import hljs from 'highlight.js';
import { useEffect, useRef, useState } from 'react';
import { CiBookmark, CiWarning } from 'react-icons/ci';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { VscShare } from 'react-icons/vsc';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import PreviewTextEditorComponent from '../../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
import { useSocket } from '../../../../context/SocketContext';
import { useAppSelector } from '../../../../redux/app/hook';
import { getPostById, resolvePost, votePostById } from '../../../../services/post/post.service';
import { NotificationTypeEnum } from '../../../../types/enum/notification.enum';
import { TypeVoteEnum } from '../../../../types/enum/typeVote.enum';
import { notifyError } from '../../../../utils/helpers/notify';
import useVoteStatus from '../../../../utils/hooks/useVoteStatus.hook';
import LoadingPage from '../../../commons/LoadingPage';
import ListCommentComponent from '../components/ListComment/ListComment.component';
import { AnonymousIcon } from '../../../../utils/icons/Anonymous.icon';
import Confetti from 'react-confetti';
const DetailDiscussPage = () => {
  const { id } = useParams<{ id: string }>();
  const socket = useSocket();
  const upvoteRef = useRef(null);
  const downvoteRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const { data: postData, isLoading, mutate } = useSWR(`detailpost/${id}`, () => getPostById(id!));
  const [messageApi, contextHolder] = message.useMessage();

  const [confettiActive, setConfettiActive] = useState(false);
  const { isVoted, isDownvoted } = useVoteStatus({
    vote: postData?.data?.vote || [],
    downVote: postData?.data?.downVote || []
  });
  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [postData?.data?.content]);
  const handleVote = async (type: TypeVoteEnum) => {
    if (!user) {
      notifyError(`You don't have permission to vote. Please login to vote...`);
      return;
    }
    try {
      const response = await votePostById(id!, type);
      if (response.success) {
        mutate();
        if ((isVoted && type === TypeVoteEnum.upvote) || (isDownvoted && type === TypeVoteEnum.downvote)) {
          return;
        }
        if (socket) {
          const notificationPayload = {
            notificationType:
              type === TypeVoteEnum.upvote ? NotificationTypeEnum.VOTE_POST : NotificationTypeEnum.DOWNVOTE_POST,
            postId: id
          };
          socket.emit('notify', notificationPayload);
        }
      } else {
        notifyError(response.message);
      }
    } catch (error) {
      notifyError(`Something went wrong. Please try again...`);
    }
  };

  const handleResolvePost = async () => {
    try {
      const response = await resolvePost(postData?.data?._id as string);
      if (response.success) {
        setConfettiActive(true);
        messageApi.open({
          type: 'success',
          content: 'Congratulations! Your problem has been resolved.'
        });
        mutate();
      } else {
        notifyError(response.message);
      }
    } catch (error) {
      notifyError((error as Error).message);
    }
  };
  // if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error loading the postData?.data.</p>;
  return (
    <div className="m-[10px] overflow-y-hidden rounded-lg shadow-md">
      {contextHolder}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        run={confettiActive}
        numberOfPieces={300}
        recycle={false}
      />
      {isLoading && (
        <div className="skeleton-wrapper w-full p-10">
          <Skeleton active />
          <LoadingPage />
        </div>
      )}
      <div className="card overflow-y-auto">
        <div className="flex justify-between">
          <div className="flex items-center gap-5">
            <div className="flex cursor-pointer items-center justify-center opacity-30 duration-200 hover:opacity-100">
              <Tooltip title="Back">
                <FaArrowLeft size={16} onClick={() => navigate(-1)} />
              </Tooltip>
            </div>
            <Divider type="vertical" className="ml-0 h-full" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{postData?.data?.title}</h1>
              {postData?.data?.resolve && (
                <Tooltip title="This post has been resolved" placement="right">
                  <FaCheck size={25} className="text-green-500" />
                </Tooltip>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {!postData?.data?.resolve &&
              (user?._id === postData?.data?.postedBy?._id || user?._id === postData?.data?.postedBy) && (
                <Popconfirm
                  title="Your problem has been resolved, has't it?"
                  onConfirm={handleResolvePost}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip title="Accept this post" placement="right">
                    <Button shape="circle">
                      <FaCheck />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              )}
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
          <div className="ml-2 flex flex-none flex-col items-center">
            <motion.button
              ref={upvoteRef}
              onClick={() => handleVote(TypeVoteEnum.upvote)}
              className={`flex h-fit items-start rounded-md text-3xl text-gray-500 hover:text-green-500 focus:outline-none focus:ring-green-500 ${isVoted && 'text-green-500'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Upvote"
            >
              <CaretUpOutlined />
            </motion.button>
            <p className="m-0 text-center text-xl font-semibold">
              {(postData?.data?.vote?.length || 0) - (postData?.data?.downVote?.length || 0) > 0
                ? (postData?.data?.vote?.length || 0) - (postData?.data?.downVote?.length || 0)
                : 0}
            </p>
            <motion.button
              ref={downvoteRef}
              onClick={() => handleVote(TypeVoteEnum.downvote)}
              className={`flex h-fit items-start rounded-md text-3xl text-gray-500 hover:text-red-500 focus:outline-none focus:ring-red-500 ${isDownvoted && 'text-red-500'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Downvote"
            >
              <CaretDownOutlined />
            </motion.button>
          </div>
          <div className="flex-auto">
            <div className="mb-4 flex items-center gap-4 text-xs">
              {postData?.data?.isAnonymous ? (
                <Avatar icon={<AnonymousIcon />} />
              ) : (
                <Link to={`/profile/${postData?.data?.postedBy?._id}`}>
                  <Avatar size={40} src={postData?.data?.postedBy?.avatar} />
                </Link>
              )}
              <div>
                <span className="mr-2 text-sm font-semibold">
                  {postData?.data?.isAnonymous ? 'Anonymous' : postData?.data?.postedBy?.username}
                </span>
                <span className="sub-title">{new Date(postData?.data?.createdAt || '').toLocaleString()}</span>
              </div>
            </div>
            <div className="prose mb-6 max-w-none">
              <PreviewTextEditorComponent content={postData?.data?.content} fontSize="sm" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          {postData?.data?.tags?.map((tag: any) => (
            <span key={tag._id} className="tag mb-2 mr-2 inline-block rounded-full px-5 py-2 text-xs font-semibold">
              #{tag.name}
            </span>
          ))}
        </div>
        <div className="border-t pt-6">
          <h2 className="mb-4 text-2xl font-bold">Comments</h2>
          <ListCommentComponent postById={postData?.data?.postedBy?._id || ''} postId={id || ''} />
        </div>
      </div>
    </div>
  );
};

export default DetailDiscussPage;
