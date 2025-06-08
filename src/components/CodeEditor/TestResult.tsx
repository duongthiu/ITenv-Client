import { RunCodeResultType, SubmissionStatusType, TestCase } from '../../types/ProblemType';
import { Empty, Tabs } from 'antd';

type TestResultProps = {
  submissionStatus?: SubmissionStatusType | RunCodeResultType;
  testCase: TestCase[];
};

const isSubmissionStatusType = (
  submissionStatus: SubmissionStatusType | RunCodeResultType
): submissionStatus is SubmissionStatusType => {
  return 'full_compile_error' in submissionStatus || 'full_runtime_error' in submissionStatus;
};

const TestResult: React.FC<TestResultProps> = ({ submissionStatus, testCase }) => {
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
                  className={`text-xl font-medium ${submissionStatus?.run_success ? 'text-green-500' : 'text-red-500'}`}
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
                  className={`text-xl font-medium ${submissionStatus?.run_success && submissionStatus?.total_correct === submissionStatus?.total_testcases ? 'text-green-500' : 'text-red-500'}`}
                >
                  {submissionStatus?.total_correct === submissionStatus?.total_testcases
                    ? submissionStatus?.status_msg
                    : 'Wrong Answer'}
                </h2>
                <span className="sub-title">Runtime: {submissionStatus?.status_runtime}</span>
              </div>
              <Tabs defaultActiveKey="0" type="card" className="w-full">
                {testCase.map((testcase, index: number) => (
                  <Tabs.TabPane tab={`Case ${index + 1}`} key={index.toString()}>
                    <div className="flex flex-col gap-4 p-4">
                      {testcase.input.map((input, idx: number) => (
                        <div key={idx} className="">
                          <h4 className="sub-title mb-2">{input.name} =</h4>
                          <pre
                            className="overflow-auto rounded-xl bg-gray-300 p-3 text-black"
                            style={{
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word'
                            }}
                          >
                            {input.value}
                          </pre>
                        </div>
                      ))}
                      <div className="flex flex-col">
                        <h4 className="sub-title mb-2">Output =</h4>
                        <pre
                          className={`min-h-[37px] overflow-auto rounded-xl bg-gray-300 p-3 text-black ${submissionStatus?.code_answer?.[index] !== submissionStatus?.expected_code_answer?.[index] && 'border border-red-500 bg-red-100 text-red-500'}`}
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                          }}
                        >
                          {submissionStatus?.code_answer?.[index]}
                        </pre>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="sub-title mb-2">Expect =</h4>
                        <pre
                          className="min-h-[37px] overflow-auto rounded-xl bg-gray-300 p-3 text-black"
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                          }}
                        >
                          {submissionStatus?.expected_code_answer?.[index]}
                        </pre>
                      </div>
                      {submissionStatus?.std_output_list[index] && (
                        <div className="flex flex-col">
                          <h4 className="sub-title mb-2">Stdout =</h4>
                          <pre
                            className="overflow-auto rounded-xl bg-gray-300 p-3 text-black"
                            style={{
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word'
                            }}
                          >
                            {submissionStatus?.std_output_list?.[index]}
                          </pre>
                        </div>
                      )}
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
