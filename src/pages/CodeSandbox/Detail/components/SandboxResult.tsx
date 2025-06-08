import { Typography, Card, Space, Alert, Spin, Tabs } from 'antd';
import { RunCodeResultType } from '../../../../types/ProblemType';

import './PreviewPanel.style.scss';

const { Text } = Typography;

interface SandboxResultProps {
  compileResult: RunCodeResultType | null;
  isCompiling: boolean;
  error?: {
    message?: string;
  } | null;
}

interface ResultTabContentProps {
  compileResult: RunCodeResultType | null;
  isCompiling: boolean;
  error?: {
    message?: string;
  } | null;
}

const ResultTabContent: React.FC<ResultTabContentProps> = ({ compileResult, isCompiling, error }) => {
  return (
    <div className="flex h-full flex-col bg-[#1e1e1e] p-4">
      <div className="flex-1 overflow-auto">
        {isCompiling ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <Spin size="large" />
            <Text className="text-gray-400">Compiling code...</Text>
          </div>
        ) : error ? (
          <Card className="bg-[#2a2a2a] text-white">
            <Alert
              message="Error"
              description={
                <pre className="mt-2 whitespace-pre-wrap break-words rounded bg-[#1e1e1e] p-3 text-red-400">
                  {error.message || 'An error occurred while compiling the code'}
                </pre>
              }
              type="error"
              showIcon
              className="bg-[#2a2a2a]"
            />
          </Card>
        ) : compileResult ? (
          <Card className="bg-[#2a2a2a] text-white">
            {compileResult.compile_error ? (
              <Alert
                message="Compilation Error"
                description={
                  <pre className="mt-2 whitespace-pre-wrap break-words rounded bg-[#1e1e1e] p-3 text-red-400">
                    {compileResult.compile_error}
                  </pre>
                }
                type="error"
                showIcon
                className="bg-[#2a2a2a]"
              />
            ) : (
              <Space direction="vertical" size="large" className="w-full">
                <Alert message="Execution successful!" type="success" showIcon className="bg-[#2a2a2a]" />

                <div className="flex gap-4 text-gray-400">
                  <Text>Runtime: {compileResult.status_runtime}</Text>
                </div>

                <div>
                  <Text strong className="text-white">
                    Output:
                  </Text>
                  <pre className="mt-2 whitespace-pre-wrap break-words rounded bg-[#1e1e1e] p-3 text-gray-300">
                    {compileResult.code_output.join('\n')}
                  </pre>
                </div>
              </Space>
            )}
          </Card>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Click Run to execute the code</div>
        )}
      </div>
    </div>
  );
};

export default function SandboxResult({ compileResult, isCompiling, error }: SandboxResultProps) {
  return (
    <Tabs
      size="large"
      type="card"
      className="preview-panel_wrapper h-full"
      items={[
        {
          key: 'result',
          label: 'Output',
          children: <ResultTabContent compileResult={compileResult} isCompiling={isCompiling} error={error} />
        }
      ]}
    />
  );
}
