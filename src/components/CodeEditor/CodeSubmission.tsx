import React from 'react';
import { SubmissionDetailType, SubmissionStatusType } from '../../types/ProblemType';
import { Empty } from 'antd';
import MemoryChart from './chart/MemoryDistribution';
type CodeSubmissionProps = {
  submissionStatus?: SubmissionStatusType;
  detailSubmission?: SubmissionDetailType;
};
const CodeSubmission: React.FC<CodeSubmissionProps> = ({ submissionStatus, detailSubmission }) => {
  return (
    <div className="h-full w-full">
      {!detailSubmission ? (
        <div className="flex h-full w-full items-center justify-center">
          <Empty />
        </div>
      ) : (
        <div>
          <MemoryChart />
        </div>
      )}
    </div>
  );
};

export default CodeSubmission;
