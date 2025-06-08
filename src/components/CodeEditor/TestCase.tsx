import { Tabs, Typography } from 'antd';

const { Title } = Typography;

type TestCaseType = {
  testCase: {
    input: {
      name: string;
      value: string;
    }[];
    isHidden: boolean;
  }[];
};

const TestCase: React.FC<TestCaseType> = ({ testCase }) => {
  const exampleTestCases = testCase.filter((tc) => !tc.isHidden);
  const hiddenTestCases = testCase.filter((tc) => tc.isHidden);

  const renderTestCase = (testcase: TestCaseType['testCase'][0], index: number) => (
    <Tabs.TabPane tab={`Case ${index + 1}`} key={index.toString()}>
      <div className="p-4">
        {testcase.input.map((input, idx) => (
          <div key={idx} className="mb-4">
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
      </div>
    </Tabs.TabPane>
  );

  return (
    <div className="space-y-6">
      {/* Example Test Cases Section */}
      {exampleTestCases.length > 0 && (
        <div>
          <Title level={4} className="mb-4">
            Example Test Cases
          </Title>
          <Tabs defaultActiveKey="0" type="card" className="w-full">
            {exampleTestCases.map((testcase, index) => renderTestCase(testcase, index))}
          </Tabs>
        </div>
      )}

      {/* Hidden Test Cases Section */}
      {hiddenTestCases.length > 0 && (
        <div>
          <Title level={4} className="mb-4">
            Hidden Test Cases
          </Title>
          <Tabs defaultActiveKey="0" type="card" className="w-full">
            {hiddenTestCases.map((testcase, index) => renderTestCase(testcase, index))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default TestCase;
