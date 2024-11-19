import React from 'react';
import { SubmissionStatusType } from '../../types/ProblemType';
import { Empty } from 'antd';
type TestResultProps = {
  submissionStatus?: SubmissionStatusType;
};
const TestResult: React.FC<TestResultProps> = ({ submissionStatus }) => {
  console.log(submissionStatus);
  return (
    <div className="h-full w-full">
      {!submissionStatus ? (
        <div className="flex h-full w-full items-center justify-center">
          <Empty />
        </div>
      ) : (
        <div className="flex flex-col">
          {!submissionStatus?.run_success ? (
            <div className="">
              <h2
                className={`text-[2rem] font-medium ${submissionStatus?.run_success ? 'text-green-500' : 'text-red-500'}`}
              >
                {submissionStatus?.status_msg}
              </h2>

              <pre className="w-full text-wrap rounded-lg bg-red-50 p-5 text-red-500">
                {submissionStatus?.full_compile_error || submissionStatus?.full_runtime_error}
              </pre>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default TestResult;
