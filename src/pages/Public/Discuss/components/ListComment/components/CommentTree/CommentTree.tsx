import React, { useMemo, useState } from 'react';
import { Tree } from 'antd';
import CommentCardComponent from '../CommentCard.component';
import { CommentType } from '../../../../../../../types/PostType';
import './CommentTree.style.scss';
type CommentTreeProps = {
  postId: string;
  comments: CommentType[]; // Top-level comments with possible children
};

const CommentTree: React.FC<CommentTreeProps> = ({ postId, comments }) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // Toggle the expanded state for a comment
  const toggleExpand = (key: string) => {
    setExpandedKeys(
      (prevKeys) =>
        prevKeys.includes(key)
          ? prevKeys.filter((k) => k !== key) // Remove key to collapse
          : [...prevKeys, key] // Add key to expand
    );
  };

  // Function to transform comments data into Tree-compatible structure
  const transformCommentsToTreeData = (comments: CommentType[]): any[] =>
    comments.map((comment) => {
      const hasChildren = comment.children && comment.children.length > 0;
      return {
        title: (
          <>
            <CommentCardComponent postId={postId} comment={comment} />
            {hasChildren && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(comment?._id || '');
                }}
                style={{ color: 'blue', cursor: 'pointer', marginLeft: 8 }}
              >
                {expandedKeys.includes(comment._id || '') ? 'Hide Replies' : 'Show Replies'}
              </span>
            )}
          </>
        ),
        key: comment._id,
        children: comment.children ? transformCommentsToTreeData(comment.children) : []
      };
    });

  const treeData = useMemo(() => transformCommentsToTreeData(comments), [comments, expandedKeys]);

  return (
    <Tree
      treeData={treeData}
      expandedKeys={expandedKeys}
      onExpand={(keys) => setExpandedKeys(keys as string[])}
      showLine={{ showLeafIcon: false }}
    />
  );
};

export default CommentTree;
