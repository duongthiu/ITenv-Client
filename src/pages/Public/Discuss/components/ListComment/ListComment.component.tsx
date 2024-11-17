import { Button, Form, Skeleton } from 'antd';
import { memo, useCallback, useState } from 'react';
import useSWR from 'swr';
import TextEditorComponent from '../../../../../components/TextEditor/TextEditor.component';
import { getCommentsByPostId, postComment } from '../../../../../services/comment/comment.service';
import { ImageType } from '../../../../../types/common';
import { CommentType } from '../../../../../types/PostType';
import { notifyError, notifySuccess } from '../../../../../utils/helpers/notify';

import CommentCardComponent from './components/CommentCard/CommentCard.component';
import './ListComment.style.scss';
import { useSocket } from '../../../../../context/SocketContext';
import CommentTree from './components/CommentTree/CommentTree';
import { NotificationRequestType } from '../../../../../types/NotificationType';
import { NotificationTypeEnum } from '../../../../../types/enum/notification.enum';
type ListCommentProps = {
  postById: string;
  postId: string;
};
const ListCommentComponent: React.FC<ListCommentProps> = memo(({ postById, postId }) => {
  const socket = useSocket();
  const [newComment, setNewComment] = useState('');
  const [postImages, setPostImages] = useState<ImageType[]>([]);
  const { data: comments, isLoading, mutate } = useSWR(`/api/comment/${postId}`, () => getCommentsByPostId(postId));

  const handleEditorChange = useCallback((content: any) => {
    setNewComment(content);
  }, []);

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      notifyError('Comment content cannot be empty');
      return;
    }

    try {
      const comment: Pick<CommentType, 'content' | 'parentComment'> = {
        content: newComment,
        parentComment: undefined
      };
      const res = await postComment(postId, comment);
      if (res.success) {
        notifySuccess('Comment posted successfully');
        setNewComment('');
        setPostImages([]);
        mutate();
        if (socket) {
          const notification: NotificationRequestType = {
            notificationType: NotificationTypeEnum.COMMENT_POST,
            postId,
            content: newComment
          };

          socket.emit('notify', notification);
        }
      } else {
        notifyError(res.message);
      }
    } catch (error) {
      notifyError('Failed to post comment');
    }
  };
  return (
    <div>
      <Form className="mt-6">
        <div className="list-comment-editor-wrapper mb-10 rounded-md border border-t-[#CFCFCF] shadow-md">
          <TextEditorComponent
            buttonTitle="Post Comment"
            buttonFunction={handleSubmit}
            keyEditor="comment"
            content={newComment}
            setContent={handleEditorChange}
            postImages={postImages}
            setPostImages={setPostImages}
          />
        </div>
      </Form>
      {isLoading && (
        <div className="skeleton-wrapper w-full p-10">
          <Skeleton active />
        </div>
      )}

      <CommentTree postById={postById} postId={postId} comments={comments?.data || []} mutate={mutate} />
    </div>
  );
});

export default ListCommentComponent;
