import hljs from 'highlight.js';
import 'highlight.js/styles/default.css'; // You can choose different themes available
import React, { useEffect } from 'react';
import './PreviewTextEditor.style.scss';
type PreviewTextEditorProps = {
  content: any;
  fontSize?: number;
  inline?: boolean;
};
const PreviewTextEditorComponent: React.FC<PreviewTextEditorProps> = ({ content, fontSize = 1.6, inline }) => {
  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block as HTMLElement);
    });
  }, [content]);

  return (
    <div className="flex h-full w-full justify-start">
      {/* {!content && (
        <Typography.Text className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          Preview
        </Typography.Text>
      )} */}
      <div
        className={`preview-text-editor-wrapper w-full overflow-y-auto text-[${fontSize}rem] ${inline && 'flex flex-wrap gap-1'}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default PreviewTextEditorComponent;
