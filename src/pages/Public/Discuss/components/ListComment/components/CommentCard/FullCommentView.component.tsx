import React, { memo, useState } from 'react';
import { Tooltip } from 'antd';
import PreviewTextEditorComponent from '../../../../../../../components/TextEditor/components/PreviewTextEditor.component.tdc';
import { CommentType } from '../../../../../../../types/PostType';

interface FullCommentViewProps {
  comment: CommentType;
}

const FullCommentView: React.FC<FullCommentViewProps> = memo(({ comment }) => {
  const [isFullComment, setIsFullComment] = useState(false);
  return (
    <div className="flex flex-col gap-5">
      {isFullComment && (
        <div className="flex-1">
          <div className="mb-4">
            At {new Date(comment?.createdAt || 0).toLocaleString()}{' '}
            <strong>{` @<${comment.commentedBy?.username}>`}</strong>
            wrote :
          </div>
          <div className="sub-title ml-3 border-l-[1px] pl-2 font-semibold">
            <PreviewTextEditorComponent content={comment?.content} fontSize="sm" />
          </div>
        </div>
      )}
      <Tooltip title="Hide">
        <button
          className="w-fit rounded-md bg-[#e8eaed] px-3 py-0 font-bold text-black"
          onClick={() => setIsFullComment(!isFullComment)}
        >
          ...
        </button>
      </Tooltip>
    </div>
  );
});

export default FullCommentView;
