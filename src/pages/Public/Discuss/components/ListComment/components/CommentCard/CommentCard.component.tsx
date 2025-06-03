import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, message, Popconfirm, Tooltip } from 'antd';
import React, { memo, useCallback, useState } from 'react';
import { FaCheck, FaReply } from 'react-icons/fa';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { PiWarningFill } from 'react-icons/pi';
import { KeyedMutator } from 'swr';
import PreviewTextEditorComponent from '../../../../../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
import TextEditorComponent from '../../../../../../../components/TextEditor/TextEditor.component';
import { useSocket } from '../../../../../../../context/SocketContext';
import { useAppSelector } from '../../../../../../../redux/app/hook';
import {
  deleteCommentById,
  editCommentById,
  postComment,
  resolveCommentById,
  voteCommentById
} from '../../../../../../../services/comment/comment.service';
import { ImageType, ResponsePagination } from '../../../../../../../types/common';
import { NotificationTypeEnum } from '../../../../../../../types/enum/notification.enum';
import { TypeVoteEnum } from '../../../../../../../types/enum/typeVote.enum';
import { NotificationRequestType } from '../../../../../../../types/NotificationType';
import { CommentType } from '../../../../../../../types/PostType';
import { notifyError, notifySuccess } from '../../../../../../../utils/helpers/notify';
import useVoteStatus from '../../../../../../../utils/hooks/useVoteStatus.hook';
import DrawerEditComment from './DrawerComment.component';
import FullCommentView from './FullCommentView.component';
import Confetti from 'react-confetti';
type CommentCartProps = {
  postId: string;
  comment: CommentType;
  mutate: KeyedMutator<ResponsePagination<CommentType[]>>;
  postById: string;
};
const CommentCardComponent: React.FC<CommentCartProps> = memo(({ comment, postId, mutate, postById }) => {
  const socket = useSocket();
  const { user } = useAppSelector((state) => state.user);
  const initContent = `<strong style="background-color: #d9e6f4; padding:4px; border-radius: 4px; margin-right:10px">@${comment.commentedBy?.username} </strong><p></p>`;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [newComment, setNewComment] = useState(initContent);
  const [postImages, setPostImages] = useState<ImageType[]>([]);
  const [commentState, setCommentState] = useState(comment);
  const [editComment, setEditComment] = useState(comment?.content);
  const [openDedit, setOpenDedit] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { isVoted, isDownvoted } = useVoteStatus({
    vote: commentState?.vote || [],
    downVote: commentState?.downVote || []
  });
  const handleEditorChange = useCallback((content: any) => {
    setNewComment(content);
  }, []);
  const handleEditorChangeForEditing = useCallback((content: any) => {
    setEditComment(content);
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
        if ((isVoted && type === TypeVoteEnum.upvote) || (isDownvoted && type === TypeVoteEnum.downvote)) {
          return;
        }
        if (socket) {
          const notificationPayload: NotificationRequestType = {
            notificationType:
              type === TypeVoteEnum.upvote ? NotificationTypeEnum.VOTE_COMMENT : NotificationTypeEnum.DOWNVOTE_COMMENT,
            postId: postId,
            commentId: comment._id
          };
          socket.emit('notify', notificationPayload);
        }
      } else {
        notifyError(response?.message || 'Something went wrong. Please try again...');
      }
    } catch (error) {
      notifyError(`Something went wrong. Please try again...`);
    }
  };
  const handleReply = async (content: string) => {
    try {
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
        if (socket) {
          const notificationPayload: NotificationRequestType = {
            notificationType: NotificationTypeEnum.REP_COMMENT,
            content: replyComment.content,
            postId: postId,
            commentId: comment._id
          };
          socket.emit('notify', notificationPayload);
        }
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
  const handleEditComment = async () => {
    try {
      const response = await editCommentById(comment?._id as string, editComment);
      if (response.success) {
        notifySuccess('Comment edited successfully');
        setCommentState(response.data!);
        onCloseEdit();
      } else {
        notifyError(response?.message || 'Something went wrong. Please try again...');
        onCloseEdit();
      }
    } catch (error) {
      notifyError((error as Error).message);
      onCloseEdit();
    }
  };
  const handleDeleteComment = async () => {
    try {
      const res = await deleteCommentById(comment?._id as string);
      if (res.success) {
        notifySuccess('Comment deleted successfully');
        mutate();
      } else {
        notifyError(res.message);
      }
    } catch (error) {
      notifyError((error as Error).message);
    }
  };
  const handleResolve = async () => {
    try {
      const res = await resolveCommentById(comment?._id as string);
      if (res.success) {
        setConfettiActive(true);
        messageApi.open({
          type: 'success',
          content: 'Congratulations! Your problem has been resolved.'
        });
        setCommentState({ ...commentState, resolve: true });
      } else {
        notifyError(res.message as string);
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
  const onCloseEdit = () => {
    setOpenDedit(false);
  };
  const onOpenEdit = () => {
    setOpenDedit(true);
  };
  return (
    <div className="mb-4 rounded-md">
      {contextHolder}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        run={confettiActive}
        numberOfPieces={300}
        recycle={false}
      />
      <div className="flex flex-col gap-5">
        <div className="flex gap-5">
          <div className="flex flex-col gap-5 pr-14">
            <div className="flex items-start gap-5">
              <Avatar className="flex-none" src={commentState?.commentedBy?.avatar} size={40} />
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold group-hover:text-primary-color">
                    {commentState?.commentedBy?.username}
                  </p>
                  <p className="sub-title text-xs">{new Date(commentState?.createdAt || 0).toLocaleString()}</p>
                </div>
                <PreviewTextEditorComponent content={commentState?.content} fontSize="sm" />
                <div className="flex items-center gap-2 text-sm duration-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(TypeVoteEnum.upvote)}
                      className={`flex h-fit items-center rounded-md text-lg text-gray-500 hover:text-green-500 focus:outline-none focus:ring-green-500 ${isVoted && 'text-green-500'}`}
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
                      className={`flex items-center rounded-md text-lg text-gray-500 hover:text-red-500 focus:outline-none focus:ring-red-500 ${isDownvoted && 'text-red-500'}`}
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

                  {user?._id === commentState?.commentedBy._id && (
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 duration-200 hover:text-blue-500" onClick={onOpenEdit}>
                        <MdModeEdit />
                        Edit
                      </button>
                      <Popconfirm
                        title="Are you sure to delete this comment?"
                        onConfirm={handleDeleteComment}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button className="flex items-center gap-2 duration-200 hover:text-error-color">
                          <MdDelete />
                          Delete
                        </button>
                      </Popconfirm>
                    </div>
                  )}
                  <button className="flex items-center gap-2 duration-200 hover:text-warning-color">
                    <PiWarningFill />
                    Report
                  </button>
                </div>
              </div>

              {commentState?.resolve ? (
                <Tooltip title="This comment has been resolved" placement="right">
                  <FaCheck size={30} className="text-green-500" />
                </Tooltip>
              ) : (
                postById === user?._id && (
                  <Popconfirm
                    title="Are you sure to accept this comment?"
                    onConfirm={handleResolve}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip
                      title="Accept this comment. This comment helps you to solve your problem"
                      placement="right"
                    >
                      <Button shape="circle" className="opacity-50">
                        <FaCheck />
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <Drawer
        title={`Reply to ${comment.commentedBy?.username}`}
        placement="bottom"
        closable={true}
        onClose={onClose}
        open={openDrawer}
        key={comment._id}
        size="large"
      >
        <div className="flex h-full flex-col gap-7">
          <FullCommentView comment={comment} />

          <div className="list-comment-editor-wrapper flex-1 border shadow-md">
            <TextEditorComponent
              buttonTitle="Post"
              keyEditor={`reply-comment ${comment?._id}`}
              content={newComment}
              setContent={handleEditorChange}
              postImages={postImages}
              setPostImages={setPostImages}
              buttonFunction={handleReply}
            />
          </div>
        </div>
      </Drawer>
      <DrawerEditComment
        newComment={editComment}
        handleEditorChange={handleEditorChangeForEditing}
        comment={comment}
        buttonFunction={handleEditComment}
        onClose={onCloseEdit}
        openDrawer={openDedit}
      />
    </div>
  );
});

export default CommentCardComponent;
