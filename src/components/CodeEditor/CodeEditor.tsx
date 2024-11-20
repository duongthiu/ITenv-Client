/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor, Monaco } from '@monaco-editor/react';
import { Divider, Select, Tabs } from 'antd';
import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaTerminal } from 'react-icons/fa';
import { IoIosCheckboxOutline } from 'react-icons/io';
import { IoCodeSlashOutline } from 'react-icons/io5';
import { THEME } from '../../redux/app/app.slice';
import { useAppSelector } from '../../redux/app/hook';
import {
  InitialCode,
  ProblemType,
  RunCodeResultType,
  SubmissionDetailType,
  SubmissionStatusType
} from '../../types/ProblemType';
import { cn } from '../../utils/helpers/cn';
import './CodeEditor.style.scss';
import Problem from './Problem';
import TestCase from './TestCase';
import TestResult from './TestResult';
import CodeSubmission from './CodeSubmission';

interface CodeEditorProps {
  problem: ProblemType;
  initCode: InitialCode;
  setInitCode: (initCode: InitialCode) => void;
  code: string;
  setCode: (code: string) => void;
  submissionStatus?: SubmissionStatusType | RunCodeResultType;
  detailSubmission?: SubmissionDetailType;
}
const getInputName = (content: string) => {
  const regex = /<strong>Input:<\/strong>(.*?)<strong>Output:<\/strong>/s;
  const match = content.match(regex);
  const inputOutputString = match ? match[1] : 'No match found';

  // Remove any HTML tags to get the inner text
  const innerText = inputOutputString.replace(/<[^>]+>/g, '').trim();

  const regex2 = /(\w+)\s*=/g; // Matches all input names before '='
  let match2;
  const inputNames: string[] = [];

  while ((match2 = regex2.exec(innerText)) !== null) {
    inputNames.push(match2[1]); // Capture all input names
  }

  return inputNames;
};
const CodeEditor: React.FC<CodeEditorProps> = ({
  problem,
  code,
  setCode,
  initCode,
  setInitCode,
  submissionStatus,
  detailSubmission
}) => {
  const theme = useAppSelector((state) => state.app.theme);
  const editorRef = useRef(null);
  const mHeight = useMotionValue(400);
  const mWidth = useMotionValue(600);
  const [activeOutputTab, setActiveOutputTab] = useState('testcase');
  const [activeProblemTab, setActiveProblemTab] = useState('des');
  const outputHeight = useMotionValue(window.innerHeight - 680);
  const [isWidthDragging, setWidthDragging] = useState(false);
  const [isHeightDragging, setHeightDragging] = useState(false);

  const parseTestcases = useMemo(
    () => (testcase: string, inputNames: string[]) => {
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
    },
    []
  );

  const parsedTestcases = parseTestcases(problem?.exampleTestcases || '', getInputName(problem?.content || ''));

  useEffect(() => {
    if (submissionStatus) {
      setActiveOutputTab('testresult'); // Switch to Test Result tab
    }
  }, [submissionStatus]);
  useEffect(() => {
    if (detailSubmission) {
      console.log(detailSubmission);
      setActiveProblemTab('submission');
    }
  }, [detailSubmission]);
  const OutputItems = [
    {
      key: 'testcase',
      label: (
        <div className="flex items-center gap-2">
          <IoIosCheckboxOutline size={20} className="text-green-500" />
          <span>Testcase</span>
        </div>
      ),

      children: <TestCase parsedTestcases={parsedTestcases} />
    },
    {
      key: 'testresult',
      label: (
        <div className="flex items-center gap-2">
          <FaTerminal size={20} className="text-green-500" />
          <span>Test Result</span>
        </div>
      ),
      children: <TestResult parsedTestcases={parsedTestcases} submissionStatus={submissionStatus} />
    }
  ];
  const ProblemTabs = [
    {
      key: 'des',
      label: (
        <div className="flex items-center gap-2">
          <IoIosCheckboxOutline size={20} className="text-green-500" />
          <span>Description</span>
        </div>
      ),

      children: <Problem problem={problem} />
    },
    {
      key: 'submission',
      label: (
        <div className="flex items-center gap-2">
          <FaTerminal size={20} className="text-green-500" />
          <span>Compile</span>
        </div>
      ),
      children: <CodeSubmission detailSubmission={detailSubmission} />
    }
  ];
  const handleMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChange = (newValue: any) => {
    setCode(newValue);
  };

  const handleDragHeight = (event: any, info: any) => {
    const newHeight = mHeight.get() + info.delta.y;
    if (newHeight > 0 && newHeight < (window.innerHeight * 75) / 100) {
      mHeight.set(newHeight);
      outputHeight.set(window.innerHeight - newHeight - 100);
    }
  };

  const handleDragWidth = (event: any, info: any) => {
    const newWidth = mWidth.get() - info.delta.x;
    if (newWidth > 20 && newWidth < (window.innerWidth * 94) / 100) {
      mWidth.set(newWidth);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const value = window.innerHeight - mHeight.get() - 280;
      outputHeight.set(value > 300 ? value : 300);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mHeight, outputHeight]);

  const handleEditorDidMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('OneDarkPro', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ token: '', foreground: 'ffffff', background: '282828' }],
      colors: {
        'editor.background': '#282828'
      }
    });
  };
  const handleChangeLanguage = (value: string) => {
    const selectedCode = problem?.initialCode.find((code) => code.langSlug === value);
    if (selectedCode) {
      setInitCode(selectedCode);
      setCode(selectedCode.code);
    }
  };
  return (
    <div style={{ height: 'calc(100vh-20px)' }} className="code-editor-wrapper flex w-full justify-end">
      <motion.div className="card h-[calc(100vh-60px)] flex-1 overflow-auto rounded-lg shadow-md">
        {mWidth.get() > (window.innerWidth * 92) / 100 ? (
          <div className={`flex h-full w-full items-center justify-center`}>
            <div className="flex -rotate-90 items-center gap-5">
              <IoCodeSlashOutline size={22} color="#21a1d3" />
              <span className="text-[1.6rem] font-semibold">Content</span>
            </div>
          </div>
        ) : (
          <Tabs
            style={{ marginBottom: 32 }}
            type="editable-card"
            defaultActiveKey="des"
            activeKey={activeProblemTab}
            onChange={setActiveProblemTab}
            items={ProblemTabs}
          />
        )}
      </motion.div>

      <motion.div
        className="relative flex h-[calc(100vh-60px)] w-fit flex-col overflow-hidden"
        transition={{ duration: 0.5 }}
      >
        <div
          className={cn(
            'card ml-2 max-w-full rounded-lg p-0 p-1 shadow-md',
            mWidth.get() < 30 && 'flex flex-col items-center justify-center'
          )}
        >
          {mWidth.get() > 30 && (
            <div>
              <div className="flex w-full items-center gap-2 px-5 py-2">
                <IoCodeSlashOutline size={20} className="text-green-500" />
                <span className="text-[1.4rem] font-semibold">Code</span>
              </div>
            </div>
          )}
          {mWidth.get() > 30 && (
            <div>
              <div className="flex items-center justify-between">
                <Select
                  className="w-fit min-w-[100px] border-none outline-none"
                  options={problem?.initialCode.map((code) => ({
                    value: code?.langSlug,
                    label: code?.lang
                  }))}
                  defaultActiveFirstOption={true} //
                  defaultValue={initCode?.langSlug}
                  onChange={handleChangeLanguage}
                />
              </div>
              <Divider className="my-[6px]" />
            </div>
          )}

          <motion.div className={cn('py-3')} style={{ height: mHeight, width: mWidth }}>
            {mWidth.get() > 30 ? (
              <Editor
                theme={theme === THEME.DARK ? 'OneDarkPro' : 'light'}
                height="100%"
                width="100%"
                defaultLanguage={initCode?.langSlug}
                value={code}
                language={initCode?.langSlug}
                beforeMount={handleEditorDidMount}
                onMount={handleMount}
                onChange={handleChange}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex rotate-90 items-center gap-5">
                  <IoCodeSlashOutline size={22} color="#21a1d3" />
                  <span className="font-semibold">Code</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <motion.div
            className="flex h-[5px] w-full cursor-row-resize items-center justify-center text-center"
            style={{
              lineHeight: '3px'
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDragHeight}
            onDragStart={() => setHeightDragging(true)}
            onDragEnd={() => setHeightDragging(false)}
          >
            <div
              className={cn(
                'flex h-[2px] w-full items-center justify-center hover:bg-blue-200',
                isHeightDragging && 'bg-blue-200'
              )}
            >
              <div className="line h-[2px] w-[30px] rounded-sm"></div>
            </div>
          </motion.div>
        </div>
        <div className="absolute left-0 top-0 flex h-full items-center justify-center">
          <motion.div
            style={{
              lineHeight: '20px'
            }}
            className="flex h-full w-[8px] cursor-col-resize items-center justify-center text-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDragWidth}
            onDragStart={() => setWidthDragging(true)}
            onDragEnd={() => setWidthDragging(false)}
          >
            <div
              className={cn(
                'flex h-full w-[3px] items-center justify-center hover:bg-blue-200',
                isWidthDragging && 'bg-blue-200'
              )}
            >
              <div className="line h-[30px] w-[3px] rounded-sm"></div>
            </div>
          </motion.div>
        </div>
        <div className="card ml-2 flex h-full max-w-full overflow-y-auto rounded-lg p-5 pt-0 shadow-md">
          <motion.div style={{ height: outputHeight, width: mWidth }} className="min-h-[100px]">
            {mWidth.get() < 30 ? (
              <div className={`flex h-full w-full items-center justify-center`}>
                <div className="flex rotate-90 items-center gap-5">
                  <IoCodeSlashOutline size={22} color="#21a1d3" />
                  <span className="font-semibold">Code</span>
                </div>
              </div>
            ) : (
              // <Output language={initCode.lang} editorRef={editorRef} />
              <div>
                <Tabs
                  defaultActiveKey="testcase"
                  activeKey={activeOutputTab}
                  onChange={setActiveOutputTab}
                  items={OutputItems}
                />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeEditor;
