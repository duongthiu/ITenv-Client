import { Divider, Empty } from 'antd';
import React from 'react';
import { SubmissionDetailType } from '../../types/ProblemType';
import MemoryChart from './chart/MemoryDistribution';
type CodeSubmissionProps = {
  detailSubmission?: SubmissionDetailType;
};
const CodeSubmission: React.FC<CodeSubmissionProps> = ({ detailSubmission }) => {
  console.log(detailSubmission);
  return (
    <div className="h-full w-full">
      {!detailSubmission ? (
        <div className="flex h-full w-full items-center justify-center">
          <Empty />
        </div>
      ) : (
        <div className="flex flex-col gap-5 p-5">
          <h2 className="text-xl font-semibold text-green-600">Accepted</h2>
          <div className="flex items-center justify-center">
            <div className="rounded-xl border p-5">
              <div className="h-[400px] w-[700px]">
                <MemoryChart />
              </div>
            </div>
          </div>
          <div className="sub-title flex items-center">
            <span>Code</span>
            <Divider type="vertical" />
            <span>{detailSubmission?.lang?.verboseName}</span>
          </div>
          <pre className="overflow-auto rounded-xl bg-gray-200 p-5 text-black">{detailSubmission?.code}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeSubmission;
