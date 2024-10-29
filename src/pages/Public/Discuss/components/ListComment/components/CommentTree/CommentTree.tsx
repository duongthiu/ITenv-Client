import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommentCardComponent from '../../../CommentCard.component';
import { CommentType } from '../../../../../../../types/PostType';
import './CommentTree.style.scss';
import { KeyedMutator } from 'swr';
import { ResponsePagination } from '../../../../../../../types/common';

type CommentTreeProps = {
  postId: string;
  comments: CommentType[]; // Top-level comments with possible children
  mutate: KeyedMutator<ResponsePagination<CommentType[]>>;
};

const CommentTree: React.FC<CommentTreeProps> = ({ postId, comments, mutate }) => {
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

  return (
    <div className="flex flex-col gap-10">
      {comments?.map((comment: CommentType) => (
        <div key={comment._id}>
          <CommentCardComponent comment={comment} postId={postId} mutate={mutate} />

          {/* Show the toggle button if the comment has children */}
          {comment.children && comment.children.length > 0 && (
            <button
              className="my-5 ml-14 mt-1 text-[1.2rem] text-blue-500 underline"
              onClick={() => toggleExpand(comment?._id || '')}
            >
              {expandedKeys.includes(comment?._id || '') ? 'Hide Replies' : `Show ${comment.children.length} replies`}
            </button>
          )}

          {/* Animated replies section */}
          <AnimatePresence>
            {expandedKeys.includes(comment._id || '') && (
              <motion.div
                className="ml-14"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {comment?.children?.map((child: CommentType) => (
                  <CommentCardComponent key={child._id} comment={child} postId={postId} mutate={mutate} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default CommentTree;
