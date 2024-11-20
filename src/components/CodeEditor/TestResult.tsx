import React from 'react';
import { RunCodeResultType, SubmissionStatusType } from '../../types/ProblemType';
import { Empty, Tabs } from 'antd';
type TestResultProps = {
  submissionStatus?: SubmissionStatusType | RunCodeResultType;
  parsedTestcases: { name: string; value: string }[][];
};
const isSubmissionStatusType = (
  submissionStatus: SubmissionStatusType | RunCodeResultType
): submissionStatus is SubmissionStatusType => {
  return 'full_compile_error' in submissionStatus || 'full_runtime_error' in submissionStatus;
};
const TestResult: React.FC<TestResultProps> = ({ submissionStatus, parsedTestcases }) => {
  console.log(submissionStatus);
  return (
    <div className="h-full w-full">
      {!submissionStatus ? (
        <div className="flex h-full w-full items-center justify-center">
          <Empty />
        </div>
      ) : (
        <div className="flex flex-col">
          {isSubmissionStatusType(submissionStatus) ? (
            !submissionStatus?.run_success ? (
              <div className="">
                <h2
                  className={`text-[2rem] font-medium ${submissionStatus?.run_success ? 'text-green-500' : 'text-red-500'}`}
                >
                  {submissionStatus?.status_msg}
                </h2>
                <pre className="w-full text-wrap rounded-lg bg-red-50 p-5 text-red-500">
                  <pre className="w-full text-wrap rounded-lg bg-red-50 p-5 text-red-500">
                    {submissionStatus.full_compile_error || submissionStatus.full_runtime_error}
                  </pre>
                </pre>
              </div>
            ) : (
              <></>
            )
          ) : (
            <div>
              <div className="mb-5 flex items-center gap-5">
                <h2
                  className={`text-[2rem] font-medium ${submissionStatus?.run_success ? 'text-green-500' : 'text-red-500'}`}
                >
                  {submissionStatus?.status_msg}
                </h2>
                <span className="sub-title">Runtime: {submissionStatus?.status_runtime}</span>
              </div>
              <Tabs defaultActiveKey="0" type="card" className="w-full">
                {parsedTestcases.map((testcase, index) => (
                  <Tabs.TabPane tab={`Case ${index + 1}`} key={index.toString()}>
                    <div className="p-4">
                      {testcase.map((singleCase, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                          {singleCase.name && <h4 className="sub-title mb-2">{singleCase.name} =</h4>}
                          <pre
                            className="overflow-auto rounded-xl bg-gray-300 p-3 text-black"
                            style={{
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word'
                            }}
                          >
                            {singleCase.value}
                          </pre>
                          <div className="flex flex-col">
                            <h4 className="sub-title mb-2">Output =</h4>
                            <pre
                              className="overflow-auto rounded-xl bg-gray-300 p-3 text-black"
                              style={{
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word'
                              }}
                            >
                              {submissionStatus.code_answer[idx]}
                            </pre>
                          </div>
                          <div className="flex flex-col">
                            <h4 className="sub-title mb-2">Expect =</h4>
                            <pre
                              className="overflow-auto rounded-xl bg-gray-300 p-3 text-black"
                              style={{
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word'
                              }}
                            >
                              {submissionStatus.expected_code_answer[idx]}
                            </pre>
                          </div>
                          {submissionStatus?.std_output_list[idx] && (
                            <div className="flex flex-col">
                              <h4 className="sub-title mb-2">Stdout =</h4>
                              <pre
                                className="overflow-auto rounded-xl bg-gray-300 p-3 text-black"
                                style={{
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word'
                                }}
                              >
                                {submissionStatus.std_output_list[idx]}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestResult;
