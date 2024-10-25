import React, { memo, useState } from 'react';
import { CommentType } from '../../../../../../types/PostType';
import { Avatar } from 'antd';
import PreviewTextEditorComponent from '../../../../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
import { motion } from 'framer-motion';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import useVoteStatus from '../../../../../../utils/hooks/useVoteStatus.hook';
import { voteCommentById } from '../../../../../../services/comment/comment.service';
import { TypeVoteEnum } from '../../../../../../types/enum/typeVote.enum';
import { notifyError } from '../../../../../../utils/helpers/notify';
import { useAppSelector } from '../../../../../../redux/app/hook';

type CommentCartProps = {
  comment: CommentType;
};
const CommentCardComponent: React.FC<CommentCartProps> = memo(({ comment }) => {
  const [commentState, setCommentState] = useState(comment);
  const { isVoted, isDownvoted } = useVoteStatus({
    vote: commentState?.vote || [],
    downVote: commentState?.downVote || []
  });

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

  return (
    <div className="mb-4 rounded-md p-4">
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
            {(commentState?.vote.length || 0) - (commentState?.downVote?.length || 0) > 0
              ? (commentState?.vote.length || 0) - (commentState?.downVote?.length || 0)
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
        <div className="comment-card card flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <Avatar className="flex-none" src={commentState?.commentBy?.avatar} size={40} />
            <div className="flex flex-col">
              <p className="text-[1.4rem] font-semibold group-hover:text-primary-color">
                {commentState?.commentBy?.username}
              </p>
              <p className="sub-title self-center">{new Date(commentState?.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <PreviewTextEditorComponent content={commentState?.content} fontSize={1.2} />
        </div>
      </div>
    </div>
  );
});

export default CommentCardComponent;
