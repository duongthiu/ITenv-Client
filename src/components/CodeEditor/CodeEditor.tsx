/* eslint-disable @typescript-eslint/no-explicit-any */
import { DiffEditor, Editor } from '@monaco-editor/react';
import { Button, Divider, Select, Tabs } from 'antd';
import { motion } from 'framer-motion';
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
import { useCodeEditor } from './hooks/code-editor';

interface CodeEditorProps {
  problem: ProblemType;
  initCode: InitialCode;
  setInitCode: (initCode: InitialCode) => void;
  code: string;
  setCode: (code: string) => void;
  submissionStatus?: SubmissionStatusType | RunCodeResultType;
  detailSubmission?: SubmissionDetailType;
  onSubmissionSelect?: (submission: SubmissionDetailType) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  problem,
  code,
  setCode,
  initCode,
  setInitCode,
  submissionStatus,
  detailSubmission,
  onSubmissionSelect
}) => {
  const theme = useAppSelector((state) => state.app.theme);
  const {
    mHeight,
    mWidth,
    activeOutputTab,
    setActiveOutputTab,
    activeProblemTab,
    setActiveProblemTab,
    outputHeight,
    isWidthDragging,
    setWidthDragging,
    isHeightDragging,
    setHeightDragging,
    isRefactoring,
    showDiff,
    // originalCode,
    refactoredCode,
    handleMount,
    handleChange,
    handleDragHeight,
    handleDragWidth,
    handleEditorDidMount,
    handleChangeLanguage,
    handleRefactor,
    handleAcceptRefactor,
    handleCancelRefactor
  } = useCodeEditor({
    problem,
    setInitCode,
    setCode,
    submissionStatus,
    detailSubmission
  });

  const OutputItems = [
    {
      key: 'testcase',
      label: (
        <div className="flex items-center gap-2">
          <IoIosCheckboxOutline size={20} className="text-green-500" />
          <span>Testcase</span>
        </div>
      ),
      children: <TestCase testCase={problem.testCase} />
    },
    {
      key: 'testresult',
      label: (
        <div className="flex items-center gap-2">
          <FaTerminal size={20} className="text-green-500" />
          <span>Test Result</span>
        </div>
      ),
      children: <TestResult testCase={problem.testCase} submissionStatus={submissionStatus} />
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
      children: <CodeSubmission detailSubmission={detailSubmission} onSubmissionSelect={onSubmissionSelect} />
    }
  ];

  return (
    <div style={{ height: 'calc(100vh-20px)' }} className="code-editor-wrapper flex w-full justify-end">
      <motion.div className="card h-[calc(100vh-60px)] flex-1 overflow-auto rounded-lg shadow-md">
        {mWidth.get() > (window.innerWidth * 92) / 100 ? (
          <div className={`flex h-full w-full items-center justify-center`}>
            <div className="flex -rotate-90 items-center gap-5">
              <IoCodeSlashOutline size={22} color="#21a1d3" />
              <span className="text-base font-semibold">Content</span>
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
            'card ml-2 max-w-full rounded-lg p-1 shadow-md',
            mWidth.get() < 30 && 'flex flex-col items-center justify-center'
          )}
        >
          {mWidth.get() > 30 && (
            <div>
              <div className="flex w-full items-center gap-2 px-2 py-2">
                <IoCodeSlashOutline size={20} className="text-green-500" />
                <span className="text-sm font-semibold">Code</span>
              </div>
            </div>
          )}
          {mWidth.get() > 30 && (
            <div>
              <div className="flex items-center justify-between p-2">
                <Select
                  className="w-fit min-w-[100px] border-none outline-none"
                  options={problem?.initialCode.map((code) => ({
                    value: code?.langSlug,
                    label: code?.lang
                  }))}
                  value={initCode?.langSlug}
                  defaultActiveFirstOption={true}
                  defaultValue={initCode?.langSlug}
                  onChange={handleChangeLanguage}
                />
                {showDiff ? (
                  <div className="flex gap-2">
                    <Button type="primary" onClick={handleAcceptRefactor}>
                      Accept Changes
                    </Button>
                    <Button onClick={handleCancelRefactor}>Cancel</Button>
                  </div>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => handleRefactor(code, initCode.langSlug)}
                    loading={isRefactoring}
                  >
                    Refactor
                  </Button>
                )}
              </div>
              <Divider className="my-2" />
            </div>
          )}

          <motion.div className={cn('w-full')} style={{ height: mHeight, width: mWidth }}>
            {mWidth.get() > 30 ? (
              showDiff ? (
                <DiffEditor
                  theme={theme === THEME.DARK ? 'vs-dark' : 'light'}
                  height="100%"
                  width="100%"
                  className="absolute h-full"
                  language={initCode?.langSlug}
                  // original={originalCode}
                  // modified={refactoredCode}
                  onMount={handleMount}
                  original={code}
                  modified={refactoredCode} 
                  options={{
                    readOnly: true,
                    renderSideBySide: false,
                    originalEditable: false,
                    modifiedEditable: false,
                    renderOverviewRuler: true,
                    renderIndicators: true,
                    renderMarginRevertIcon: true,
                    renderOverviewGutter: true,
                    renderWhitespace: 'all',
                    renderLineHighlight: 'all',
                    renderIndentGuides: true,
                    renderValidationDecorations: 'on',
                    renderLineNumbers: 'on',
                    renderGlyphMargin: true,
                    renderFolding: true,
                    renderLineDecorationsWidth: 10,
                    renderLineNumbersMinChars: 3,
                    renderLineHighlightOnlyWhenFocus: false,
                    enableSplitViewResizing: false
                  }}
                />
              ) : (
                <Editor
                  theme={theme === THEME.DARK ? 'vs-dark' : 'light'}
                  height="100%"
                  width="100%"
                  className="absolute h-full"
                  defaultLanguage={initCode?.langSlug}
                  value={code}
                  language={initCode?.langSlug}
                  beforeMount={handleEditorDidMount}
                  onMount={handleMount}
                  onChange={handleChange}
                />
              )
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
