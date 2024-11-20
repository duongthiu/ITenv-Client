import { Tabs } from 'antd';
import React from 'react';

type TestCaseType = {
  parsedTestcases: { name: string; value: string }[][];
};

const TestCase: React.FC<TestCaseType> = ({ parsedTestcases }) => {
  return (
    <Tabs defaultActiveKey="0" type="card" className="w-full">
      {parsedTestcases.map((testcase, index) => (
        <Tabs.TabPane tab={`Case ${index + 1}`} key={index.toString()}>
          <div className="p-4">
            {testcase.map((singleCase, idx) => (
              <div key={idx} className="mb-4">
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
              </div>
            ))}
          </div>
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};

export default TestCase;
