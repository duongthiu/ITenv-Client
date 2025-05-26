import { Divider, Empty, Progress, Tag, Collapse, Typography, Table, Skeleton, Button } from 'antd';
import React from 'react';
import { SubmissionDetailType, CodeReviewType } from '../../types/ProblemType';
import { getSubmissionsByUserAndProblem } from '../../services/problem/problem.service';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/app/hook';
import { timeAgo } from '../../utils/helpers/formatDate';
import useSWR from 'swr';
import { ChevronLeft } from 'lucide-react';

type CodeSubmissionProps = {
  isDetail: boolean;
  detailSubmission?: SubmissionDetailType;
  onSubmissionSelect?: (submission: SubmissionDetailType) => void;
  setIsDetail: (isDetail: boolean) => void;
};

const ReviewSection: React.FC<{ review: CodeReviewType }> = ({ review }) => {
  const reviewItems = [
    {
      key: '1',
      label: 'Code Review',
      children: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Progress
                type="dashboard"
                steps={{ count: 5, gap: 5 }}
                strokeWidth={20}
                percent={review.overallScore * 10}
                format={(percent) => `${review.overallScore}/10`}
                status={review.overallScore >= 7 ? 'success' : review.overallScore >= 5 ? 'normal' : 'exception'}
                size={64}
              />
              <div className="text-lg font-semibold">Overall Score</div>
            </div>
            <Tag color={review.overallScore >= 7 ? 'success' : review.overallScore >= 5 ? 'warning' : 'error'}>
              {review.overallScore >= 7 ? 'Good' : review.overallScore >= 5 ? 'Average' : 'Needs Improvement'}
            </Tag>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="mb-2 font-semibold">Feedback</h4>
            <p className="">{review.feedback}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 small_desktop:grid-cols-2">
            <ComplexityAnalysis complexity={review.complexityAnalysis} />
            <MemoryUsage memory={review.memoryUsage} />
          </div>

          <AlgorithmSuitability suitability={review.algorithmSuitability} />

          <div className="grid grid-cols-1 gap-4 small_desktop:grid-cols-2">
            <SuggestionsList suggestions={review.suggestions} />
            <BestPracticesList practices={review.bestPractices} />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="mt-4">
      <Collapse items={reviewItems} defaultActiveKey={['1']} />
    </div>
  );
};

const ComplexityAnalysis: React.FC<{ complexity: CodeReviewType['complexityAnalysis'] }> = ({ complexity }) => (
  <div className="rounded-lg border p-4">
    <h4 className="mb-2 font-semibold">Complexity Analysis</h4>
    <div className="space-y-2">
      <div>
        <span className="">Time Complexity:</span>
        <span className="ml-2 font-medium">{complexity.timeComplexity}</span>
      </div>
      <div>
        <span className="">Space Complexity:</span>
        <span className="ml-2 font-medium">{complexity.spaceComplexity}</span>
      </div>
      <div>
        <span className="">Big-O Notation:</span>
        <span className="ml-2 font-medium">{complexity.bigONotation}</span>
      </div>
    </div>
  </div>
);

const MemoryUsage: React.FC<{ memory: CodeReviewType['memoryUsage'] }> = ({ memory }) => (
  <div className="rounded-lg border p-4">
    <h4 className="mb-2 font-semibold">Memory Usage</h4>
    <div className="space-y-2">
      <div>
        <span className="">Estimated Memory:</span>
        <span className="ml-2 font-medium">{memory.estimatedMemory}</span>
      </div>
      {memory.potentialMemoryIssues.length > 0 && (
        <div>
          <span className="">Potential Issues:</span>
          <ul className="ml-4 list-disc">
            {memory.potentialMemoryIssues.map((issue, index) => (
              <li key={index} className="text-red-600">
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const AlgorithmSuitability: React.FC<{ suitability: CodeReviewType['algorithmSuitability'] }> = ({ suitability }) => (
  <div className="rounded-lg border p-4">
    <h4 className="mb-2 font-semibold">Algorithm Suitability</h4>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="">Is Optimal:</span>
        <Tag color={suitability.isOptimal ? 'success' : 'warning'}>{suitability.isOptimal ? 'Yes' : 'No'}</Tag>
      </div>
      <div>
        <span className="">Reasoning:</span>
        <p className="mt-1">{suitability.reasoning}</p>
      </div>
      {suitability.alternativeApproaches.length > 0 && (
        <div>
          <span className="">Alternative Approaches:</span>
          <ul className="ml-4 list-disc">
            {suitability.alternativeApproaches.map((approach, index) => (
              <li key={index} className="">
                {approach}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const SuggestionsList: React.FC<{ suggestions: string[] }> = ({ suggestions }) => (
  <div className="rounded-lg border p-4">
    <h4 className="mb-2 font-semibold">Suggestions</h4>
    <ul className="list-disc pl-4">
      {suggestions.map((suggestion, index) => (
        <li key={index} className="">
          {suggestion}
        </li>
      ))}
    </ul>
  </div>
);

const BestPracticesList: React.FC<{ practices: string[] }> = ({ practices }) => (
  <div className="rounded-lg border p-4">
    <h4 className="mb-2 font-semibold">Best Practices</h4>
    <ul className="list-disc pl-4">
      {practices.map((practice, index) => (
        <li key={index} className="">
          {practice}
        </li>
      ))}
    </ul>
  </div>
);

const TestCaseResults: React.FC<{
  code_answer: string[];
  expected_code_answer?: string[];
  code_output?: string[];
}> = ({ code_answer, expected_code_answer, code_output }) => (
  <div className="mt-4">
    <h3 className="mb-2 font-semibold">Test Cases Results</h3>
    <div className="space-y-4">
      {code_answer.map((answer, index) => (
        <div key={index} className="rounded-lg border p-4">
          <div className="mb-2">
            <strong>Test Case {index + 1}:</strong>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h4 className="sub-title mb-2">Output =</h4>
              <pre
                className={`min-h-[37px] overflow-auto rounded-xl bg-gray-300 p-3 text-black ${
                  answer !== expected_code_answer?.[index] && 'border border-red-500 bg-red-100 text-red-500'
                }`}
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}
              >
                {answer}
              </pre>
            </div>
            {expected_code_answer && (
              <div className="flex flex-col">
                <h4 className="sub-title mb-2">Expect =</h4>
                <pre
                  className="min-h-[37px] overflow-auto rounded-xl bg-gray-300 p-3 text-black"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}
                >
                  {expected_code_answer[index]}
                </pre>
              </div>
            )}
            {code_output && code_output[index] && (
              <div className="flex flex-col">
                <h4 className="sub-title mb-2">Stdout =</h4>
                <pre
                  className="overflow-auto rounded-xl bg-gray-300 p-3 text-black"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}
                >
                  {code_output[index]}
                </pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SubmissionList: React.FC<{
  submissions: SubmissionDetailType[];
  onSelect: (submission: SubmissionDetailType) => void;
}> = ({ submissions, onSelect }) => {
  const columns = [
    {
      title: 'Status',
      dataIndex: 'isAccepted',
      key: 'status',
      render: (_: any, record: SubmissionDetailType) => (
        <Tag color={record.isAccepted ? 'green' : 'red'}>{record.isAccepted ? 'Accepted' : record.status_msg}</Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => <span>{timeAgo(createdAt)}</span>
    },
    {
      title: 'Language',
      dataIndex: ['code', 'language'],
      key: 'language',
      render: (_: any, record: SubmissionDetailType) => <Tag>{record.code?.language}</Tag>
    },
    {
      title: 'Compare Result',
      key: 'compare',
      render: (_: any, record: SubmissionDetailType) => (
        <span>
          {record.total_correct}/{record.total_testcases}
        </span>
      )
    },
    {
      title: 'Memory',
      dataIndex: 'status_memory',
      key: 'memory'
    },
    {
      title: 'Runtime',
      dataIndex: 'status_runtime',
      key: 'runtime'
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={submissions}
      scroll={{ x: 500 }}
      rowKey={(record) => record._id}
      pagination={false}
      onRow={(record) => ({
        onClick: () => onSelect(record),
        style: { cursor: 'pointer' }
      })}
    />
  );
};

const CodeSubmission: React.FC<CodeSubmissionProps> = ({
  isDetail = false,
  detailSubmission,
  onSubmissionSelect,
  setIsDetail
}) => {
  const { user } = useAppSelector((state) => state.user);
  const { slug } = useParams<{ slug: string }>();

  const { data: submissions, isLoading } = useSWR(
    user?._id && slug ? `/api/submission/${user._id}/problem?slug=${slug}` : null,
    () => (user?._id && slug ? getSubmissionsByUserAndProblem(user._id, slug) : null)
  );

  if (!user?._id || !slug) return null;

  if (!detailSubmission || !isDetail) {
    return (
      <div className="flex h-full w-full flex-col gap-4 p-5">
        <Typography.Title level={4}>Your Submissions</Typography.Title>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Skeleton active />
          </div>
        ) : (submissions?.data?.length ?? 0) > 0 ? (
          <SubmissionList
            submissions={submissions!.data || []}
            onSelect={(submission) => {
              onSubmissionSelect?.(submission);
              setIsDetail(true);
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Empty description="No submissions yet" />
          </div>
        )}
      </div>
    );
  }

  const {
    isAccepted,
    status_msg,
    status_runtime,
    status_memory,
    total_correct,
    total_testcases,
    code,
    code_answer,
    code_output,
    expected_code_answer,
    compile_error,
    review
  } = detailSubmission;

  const successRate = (total_correct / total_testcases) * 100;

  return (
    <div className="flex h-full w-full flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button className="w-fit" onClick={() => setIsDetail(false)}>
            <ChevronLeft />
          </Button>
          <h2 className={`text-xl font-semibold ${isAccepted ? 'text-green-600' : 'text-red-600'}`}>{status_msg}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Tag color={isAccepted ? 'success' : 'error'}>
            {total_correct}/{total_testcases} Test Cases
          </Tag>
          <Tag color="blue">{status_runtime}</Tag>
          <Tag color="purple">{status_memory}</Tag>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Progress percent={successRate} status={isAccepted ? 'success' : 'exception'} size="small" />
        </div>
      </div>

      {compile_error && (
        <div className="rounded-lg bg-red-50 p-4">
          <h3 className="mb-2 font-semibold text-red-600">Compilation Error</h3>
          <pre className="whitespace-pre-wrap text-sm text-red-700">{compile_error}</pre>
        </div>
      )}

      <div className="sub-title flex items-center">
        <span>Code</span>
        <Divider type="vertical" />
        <span>{code.language}</span>
      </div>
      <pre className="overflow-auto rounded-xl bg-gray-200 p-5 text-black">{code.content}</pre>

      {code_answer && code_answer.length > 0 && (
        <TestCaseResults
          code_answer={code_answer}
          expected_code_answer={expected_code_answer}
          code_output={code_output}
        />
      )}

      {review && <ReviewSection review={review} />}
    </div>
  );
};

export default CodeSubmission;
