import { Drawer } from 'antd';
import React, {  useState } from 'react';
import TextEditorComponent from '../../../../../../../components/TextEditor/TextEditor.component';
import { ImageType } from '../../../../../../../types/common';
import { CommentType } from '../../../../../../../types/PostType';

interface DrawerCommentProps {
  comment: CommentType;
  buttonFunction: (content: string) => void;
  onClose: () => void;
  openDrawer: boolean;
  handleEditorChange: (content: string) => void;
  newComment: string;
}

const DrawerEditComment: React.FC<DrawerCommentProps> = ({
  comment,
  buttonFunction,
  onClose,
  openDrawer,
  newComment,
  handleEditorChange
}) => {
  const [postImages, setPostImages] = useState<ImageType[]>([]);

  return (
    <Drawer
      title={` Edit Comment`}
      placement="bottom"
      closable={true}
      onClose={onClose}
      open={openDrawer}
      key={'Edit Comment' + comment._id}
      size="large"
    >
      <div className="flex h-full flex-col gap-7">
        <div className="list-comment-editor-wrapper flex flex-1 border shadow-md">
          <TextEditorComponent
            key={'edit' + comment._id}
            keyEditor={'edit' + comment._id}
            content={newComment}
            setContent={handleEditorChange}
            postImages={postImages || []}
            setPostImages={setPostImages}
            buttonFunction={buttonFunction}
            buttonTitle={'Edit'}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerEditComment;
