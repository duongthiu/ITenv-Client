import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Tooltip } from 'antd';
import React, { memo, useCallback, useState } from 'react';
import { FaReply } from 'react-icons/fa';
import { PiWarningFill } from 'react-icons/pi';
import { KeyedMutator } from 'swr';
import PreviewTextEditorComponent from '../../../../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
import TextEditorComponent from '../../../../../../components/TextEditor/TextEditor.component';
import { useAppSelector } from '../../../../../../redux/app/hook';
import { postComment, voteCommentById } from '../../../../../../services/comment/comment.service';
import { ImageType, ResponsePagination } from '../../../../../../types/common';
import { TypeVoteEnum } from '../../../../../../types/enum/typeVote.enum';
import { CommentType } from '../../../../../../types/PostType';
import { notifyError, notifySuccess } from '../../../../../../utils/helpers/notify';
import useVoteStatus from '../../../../../../utils/hooks/useVoteStatus.hook';
import { MdModeEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
type CommentCartProps = {
  postId: string;
  comment: CommentType;
  mutate: KeyedMutator<ResponsePagination<CommentType[]>>;
};
const CommentCardComponent: React.FC<CommentCartProps> = memo(({ comment, postId, mutate }) => {
  const initContent = `<strong>@${comment.commentBy?.username} </strong>` + '<br>';
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isFullComment, setIsFullComment] = useState(false);
  const [newComment, setNewComment] = useState(initContent);
  const [postImages, setPostImages] = useState<ImageType[]>([]);
  const [commentState, setCommentState] = useState(comment);
  const { user } = useAppSelector((state) => state.user);
  const { isVoted, isDownvoted } = useVoteStatus({
    vote: commentState?.vote || [],
    downVote: commentState?.downVote || []
  });
  const handleEditorChange = useCallback((content: any) => {
    setNewComment(content);
  }, []);

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
        mutate();
        // if (socket) {
        //   socket.emit('notify', { message: 'comment ne' });
        // }
        onClose();
      } else {
        notifyError(res.message);
        onClose();
      }
    } catch (error) {
      notifyError((error as Error).message);
      onClose();
    }
  };
  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  return (
    <div className="mb-4 rounded-md">
      <div className="flex flex-col gap-5">
        <div className="flex gap-5">
          <div className="flex flex-col gap-5 pr-14">
            <div className="flex items-start gap-5">
              <Avatar className="flex-none" src={commentState?.commentBy?.avatar} size={40} />
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <p className="text-[1.4rem] font-semibold group-hover:text-primary-color">
                    {commentState?.commentBy?.username}
                  </p>
                  <p className="sub-title text-[1.2rem]">{new Date(commentState?.createdAt || 0).toLocaleString()}</p>
                </div>
                <PreviewTextEditorComponent content={commentState?.content} fontSize={1.4} />
                <div className="flex items-center gap-8 text-[1.4rem] duration-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(TypeVoteEnum.upvote)}
                      className={`flex h-fit items-center rounded-md text-[1.8rem] text-gray-500 hover:text-green-500 focus:outline-none focus:ring-green-500 ${isVoted && 'text-green-500'}`}
                      // whileHover={{ scale: 1.1 }}
                      //   whileTap={{ scale: 0.9 }}
                      aria-label="Upvote"
                    >
                      <CaretUpOutlined size={16} />
                    </button>
                    <p className="m-0 text-center font-semibold">
                      {(commentState?.vote?.length || 0) - (commentState?.downVote?.length || 0) > 0
                        ? (commentState?.vote?.length || 0) - (commentState?.downVote?.length || 0)
                        : 0}
                    </p>
                    <button
                      onClick={() => handleVote(TypeVoteEnum.downvote)}
                      className={`flex items-center rounded-md text-[1.8rem] text-gray-500 hover:text-red-500 focus:outline-none focus:ring-red-500 ${isDownvoted && 'text-red-500'}`}
                      // whileHover={{ scale: 1.1 }}
                      // whileTap={{ scale: 0.9 }}
                      aria-label="Downvote"
                    >
                      <CaretDownOutlined />
                    </button>
                  </div>
                  <button
                    className="flex items-center gap-2 duration-200 hover:text-primary-color"
                    onClick={showDrawer}
                  >
                    <FaReply />
                    Reply
                  </button>

                  {user?._id === commentState?.commentBy._id && (
                    <div className="flex items-center gap-8">
                      <button className="flex items-center gap-2 duration-200 hover:text-blue-500" onClick={showDrawer}>
                        <MdModeEdit />
                        Edit
                      </button>
                      <button className="flex items-center gap-2 duration-200 hover:text-error-color">
                        <MdDelete />
                        Delete
                      </button>
                    </div>
                  )}
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
        closable={true}
        onClose={onClose}
        open={openDrawer}
        key={comment._id}
      >
        <div className="flex flex-col gap-7">
          {isFullComment ? (
            <div className="flex flex-col gap-5">
              <div className="flex-1">
                <div className="mb-4">
                  At {new Date(commentState?.createdAt || 0).toLocaleString()}{' '}
                  <strong>{` @<${comment.commentBy?.username}>`}</strong> wrote :
                </div>
                <div className="sub-title ml-3 border-l-[1px] pl-2 font-semibold">
                  <PreviewTextEditorComponent content={commentState?.content} fontSize={1.4} />
                </div>
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
              key={`reply-comment ${comment?._id}`}
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
