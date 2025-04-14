import { Button, Input, Switch, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface TestCase {
  id: string;
  inputs: Array<{ id: string; name: string; value: string }>;
  output: string;
  isHidden: boolean;
}

interface TestCasesProps {
  testCases: TestCase[];
  addTestCase: () => void;
  removeTestCase: (id: string) => void;
  addInput: (testCaseId: string) => void;
  removeInput: (testCaseId: string, inputId: string) => void;
  updateInput: (testCaseId: string, inputId: string, field: 'name' | 'value', value: string) => void;
  updateTestCase: (testCaseId: string, field: 'output' | 'isHidden', value: string | boolean) => void;
}

const TestCases: React.FC<TestCasesProps> = ({
  testCases,
  addTestCase,
  removeTestCase,
  addInput,
  removeInput,
  updateInput,
  updateTestCase
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="primary" icon={<PlusOutlined />} onClick={addTestCase}>
          Add Test Case
        </Button>
      </div>

      {testCases.length === 0 ? (
        <div className="text-center">
          <Text type="secondary">No test cases added yet</Text>
        </div>
      ) : (
        testCases.map((testCase, index) => (
          <div key={testCase.id} className="rounded-lg border p-4">
            <div className="mb-4 flex items-center justify-between">
              <Title level={4}>Test Case {index + 1}</Title>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={testCase.isHidden}
                    onChange={(checked) => updateTestCase(testCase.id, 'isHidden', checked)}
                  />
                  <Text>Hidden</Text>
                </div>
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeTestCase(testCase.id)} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Text strong>Inputs</Text>
                  <Button type="link" onClick={() => addInput(testCase.id)}>
                    <PlusOutlined /> <Text>Add Input</Text>
                  </Button>
                </div>
                {testCase.inputs.map((input) => (
                  <div key={input.id} className="mb-2 flex items-center space-x-2">
                    <Input
                      placeholder="Name"
                      value={input.name}
                      onChange={(e) => updateInput(testCase.id, input.id, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={input.value}
                      onChange={(e) => updateInput(testCase.id, input.id, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeInput(testCase.id, input.id)}
                      disabled={testCase.inputs.length <= 1}
                    />
                  </div>
                ))}
              </div>

              <div>
                <Text strong>Expected Output</Text>
                <Input.TextArea
                  placeholder="Expected output for this test case"
                  value={testCase.output}
                  onChange={(e) => updateTestCase(testCase.id, 'output', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TestCases;
