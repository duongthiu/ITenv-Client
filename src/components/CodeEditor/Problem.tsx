import { Typography } from 'antd';
import React from 'react';
import { ProblemType } from '../../types/ProblemType';
import './CodeEditor.style.scss';
const { Title } = Typography;

const Problem: React.FC<{ problem: ProblemType }> = ({ problem }) => {
  return (
    <div className="bg-card text-foreground h-full w-full p-3">
      <Title level={3} className="mb-4">
        {problem?.title}
      </Title>
      <div
        className="preview-text-editor-wrapper w-fit text-sm"
        dangerouslySetInnerHTML={{
          __html: problem?.content?.replace(/<pre/g, '<pre class="pre-wrapper"')
        }}
      />
    </div>
  );
};

export default Problem;
