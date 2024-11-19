import { Tabs } from 'antd';
import React from 'react';

type TestCaseType = {
  testcase: string;
  inputNames: string[];
};

const TestCase: React.FC<TestCaseType> = ({ testcase, inputNames }) => {
  const parseTestcases = (testcase: string, inputNames: string[]) => {
    inputNames = inputNames.length ? inputNames : [''];
    const testcases = [];
    const inputoutput = testcase.split('\n');

    while (inputoutput.length > 0) {
      const testcase: { name: string; value: string }[] = [];

      inputNames.forEach((inputName) => {
        testcase.push({ name: inputName, value: inputoutput[0] });
        inputoutput.shift(); // removes the first element from inputoutput array
      });

      testcases.push(testcase);
    }

    return testcases;
  };

  const parsedTestcases = parseTestcases(testcase, inputNames);

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
