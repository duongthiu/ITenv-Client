import { memo, useCallback, useState } from 'react';
import { CommentType } from '../../../../../types/PostType';
import TextEditorComponent from '../../../../../components/TextEditor/TextEditor.component';
import { ImageType } from '../../../../../types/common';
import './ListComment.style.scss';
import { getCommentsByPostId, postComment } from '../../../../../services/comment/comment.service';
import useSWR from 'swr';
import { Avatar, Button, Form, Skeleton } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../../../redux/app/hook';
import { openErrorModal, openSuccessModal } from '../../../../../redux/app/app.slice';
import PreviewTextEditorComponent from '../../../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
type ListCommentProps = {
  postId: string;
};
const ListCommentComponent: React.FC<ListCommentProps> = memo(({ postId }) => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [newComment, setNewComment] = useState('');
  const [postImages, setPostImages] = useState<ImageType[]>([]);
  const { data: comments, isLoading, mutate } = useSWR(`/api/comment/${postId}`, () => getCommentsByPostId(postId));
  const handleEditorChange = useCallback((content: any) => {
    setNewComment(content);
  }, []);

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      dispatch(openErrorModal({ description: 'Comment content cannot be empty' }));
      return;
    }

    try {
      const comment: Pick<CommentType, 'content' | 'parentComment'> = {
        content: newComment,
        parentComment: undefined
      };
      const res = await postComment(postId, comment);
      if (res.success) {
        dispatch(openSuccessModal({ description: 'Comment posted successfully' }));
        setNewComment('');
        setPostImages([]);
        mutate(); // Refresh the comments list
      } else {
        dispatch(openErrorModal({ description: res.message }));
      }
    } catch (error) {
      dispatch(openErrorModal({ description: 'Failed to post comment' }));
    }
  };
  return (
    <div>
      <Form className="mt-6" onFinish={handleSubmit}>
        <TextEditorComponent
          content={newComment}
          setContent={handleEditorChange}
          postImages={postImages}
          setPostImages={setPostImages}
        />
        <Form.Item>
          <Button type="primary" htmlType="submit" className="mt-2 rounded-md bg-blue-500 text-white">
            Post Comment
          </Button>
        </Form.Item>
      </Form>
      {isLoading && (
        <div className="skeleton-wrapper w-full p-10">
          <Skeleton active />
        </div>
      )}
      {comments?.data?.map((comment: CommentType) => (
        <div key={comment._id} className="mb-4 rounded-md p-4">
          <div className="flex gap-5">
            <Avatar className="flex-none" src={comment?.commentBy?.avatar} size={40} />
            <div className="comment-card card flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <p className="sub-title text-[1.2rem] group-hover:text-primary-color">{comment?.commentBy?.username}</p>
                <p>{new Date(comment?.createdAt).toLocaleString()}</p>
              </div>
              <PreviewTextEditorComponent content={comment?.content} fontSize={1.2} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ListCommentComponent;
