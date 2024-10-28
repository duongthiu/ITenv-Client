import React, { memo, useCallback, useState } from 'react';
import { CommentType } from '../../../../../../types/PostType';
import { Avatar, Drawer, Tooltip } from 'antd';
import PreviewTextEditorComponent from '../../../../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
import { motion } from 'framer-motion';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import useVoteStatus from '../../../../../../utils/hooks/useVoteStatus.hook';
import { postComment, voteCommentById } from '../../../../../../services/comment/comment.service';
import { TypeVoteEnum } from '../../../../../../types/enum/typeVote.enum';
import { notifyError, notifySuccess } from '../../../../../../utils/helpers/notify';
import { useAppSelector } from '../../../../../../redux/app/hook';
import { FaReply } from 'react-icons/fa';
import { PiWarningFill } from 'react-icons/pi';
import { ImageType } from '../../../../../../types/common';
import TextEditorComponent from '../../../../../../components/TextEditor/TextEditor.component';
import { mutate } from 'swr';

type CommentCartProps = {
  postId: string;
  comment: CommentType;
};
const CommentCardComponent: React.FC<CommentCartProps> = memo(({ comment, postId }) => {
  console.log(comment);
  const initContent = `<strong>@${comment.commentBy?.username} </strong> <br/> `;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isFullComment, setIsFullComment] = useState(false);
  const [newComment, setNewComment] = useState(initContent);
  const [postImages, setPostImages] = useState<ImageType[]>([]);
  const [commentState, setCommentState] = useState(comment);
  const { isVoted, isDownvoted } = useVoteStatus({
    vote: commentState?.vote || [],
    downVote: commentState?.downVote || []
  });
  const handleEditorChange = useCallback((content: any) => {
    setNewComment(content);
  }, []);

  const { user } = useAppSelector((state) => state.user);
  const handleVote = async (type: TypeVoteEnum) => {
    if (!user) {
      notifyError(`You don't have permission to vote. Please login to vote...`);
      return;
    }
    try {
      const response = await voteCommentById(comment?._id as string, type);
      if (response.success) {
        setCommentState(response.data!);
      } else {
        notifyError(response?.message || 'Something went wrong. Please try again...');
      }
    } catch (error) {
      notifyError(`Something went wrong. Please try again...`);
    }
  };
  const handleReply = async (content: string) => {
    try {
      console.log('newcomment', newComment);
      const replyComment: Pick<CommentType, 'content' | 'parentComment'> = {
        content,
        parentComment: comment?._id
      };
      const res = await postComment(postId, replyComment);

      if (res.success) {
        notifySuccess('Comment posted successfully');
        setNewComment('');
        setPostImages([]);
        //  mutate();
        // if (socket) {
        //   socket.emit('notify', { message: 'comment ne' });
        // }
      } else {
        notifyError(res.message);
      }
    } catch (error) {
      notifyError((error as Error).message);
    }
  };
  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  return (
    <div className="mb-4 rounded-md p-4">
      <div className="flex flex-col gap-5">
        <div className="flex gap-5">
          <div className="ml-8 flex flex-none flex-col items-center">
            <motion.button
              onClick={() => handleVote(TypeVoteEnum.upvote)}
              className={`h-fit rounded-md text-[2rem] text-gray-500 hover:text-green-500 focus:outline-none focus:ring-green-500 ${isVoted && 'text-green-500'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Upvote"
            >
              <CaretUpOutlined />
            </motion.button>
            <p className="m-0 text-center text-[2rem] font-semibold">
              {(commentState?.vote?.length || 0) - (commentState?.downVote?.length || 0) > 0
                ? (commentState?.vote?.length || 0) - (commentState?.downVote?.length || 0)
                : 0}
            </p>
            <motion.button
              onClick={() => handleVote(TypeVoteEnum.downvote)}
              className={`rounded-md text-[2rem] text-gray-500 hover:text-red-500 focus:outline-none focus:ring-red-500 ${isDownvoted && 'text-red-500'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Downvote"
            >
              <CaretDownOutlined />
            </motion.button>
          </div>
          <div className="comment-card card flex flex-col gap-5 pr-14">
            <div className="flex items-start gap-5">
              <Avatar className="flex-none" src={commentState?.commentBy?.avatar} size={40} />
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <p className="text-[1.4rem] font-semibold group-hover:text-primary-color">
                    {commentState?.commentBy?.username}
                  </p>
                  <p className="sub-title self-center">{new Date(commentState?.createdAt || 0).toLocaleString()}</p>
                </div>
                <PreviewTextEditorComponent content={commentState?.content} fontSize={1.2} />
                <div className="flex items-center gap-5 text-[1.2rem]">
                  <button
                    className="flex items-center gap-2 duration-200 hover:text-primary-color"
                    onClick={showDrawer}
                  >
                    <FaReply />
                    Reply
                  </button>
                  <button className="flex items-center gap-2 duration-200 hover:text-warning-color">
                    <PiWarningFill />
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        title={`Reply to ${comment.commentBy?.username}`}
        placement="bottom"
        closable={false}
        onClose={onClose}
        open={openDrawer}
        key={comment._id}
      >
        <div className="flex flex-col gap-7">
          {isFullComment ? (
            <div className="flex flex-col gap-5">
              <div className="h-[50px]">
                <PreviewTextEditorComponent content={commentState?.content} fontSize={1.2} />
              </div>{' '}
              <Tooltip title="Hide">
                <button
                  className="w-fit rounded-md bg-[#e8eaed] px-3 py-0 font-bold text-black"
                  onClick={() => setIsFullComment(false)}
                >
                  ...
                </button>
              </Tooltip>
            </div>
          ) : (
            <Tooltip title="Show">
              <button
                className="w-fit rounded-md bg-[#e8eaed] px-3 py-0 font-bold text-black"
                onClick={() => setIsFullComment(true)}
              >
                ...
              </button>
            </Tooltip>
          )}

          <div className="list-comment-editor-wrapper border shadow-md">
            <TextEditorComponent
              buttonTitle="Post"
              key="reply-comment"
              content={newComment}
              setContent={handleEditorChange}
              postImages={postImages}
              setPostImages={setPostImages}
              buttonFunction={handleReply}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
});

export default CommentCardComponent;
