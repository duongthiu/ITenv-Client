import { useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Monaco } from '@monaco-editor/react';
import { message } from 'antd';
import {
  InitialCode,
  ProblemType,
  RunCodeResultType,
  SubmissionDetailType,
  SubmissionStatusType
} from '../../../types/ProblemType';
import { refactorCode } from '../../../services/ai/ai.service';

interface UseCodeEditorProps {
  problem: ProblemType;
  setInitCode: (initCode: InitialCode) => void;
  setCode: (code: string) => void;
  submissionStatus?: SubmissionStatusType | RunCodeResultType;
  detailSubmission?: SubmissionDetailType;
}

export const useCodeEditor = ({
  problem,
  setInitCode,
  setCode,
  submissionStatus,
  detailSubmission
}: UseCodeEditorProps) => {
  const editorRef = useRef(null);
  const mHeight = useMotionValue(400);
  const mWidth = useMotionValue(600);
  const [activeOutputTab, setActiveOutputTab] = useState('testcase');
  const [activeProblemTab, setActiveProblemTab] = useState('des');
  const outputHeight = useMotionValue(window.innerHeight - 680);
  const [isWidthDragging, setWidthDragging] = useState(false);
  const [isHeightDragging, setHeightDragging] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [originalCode, setOriginalCode] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');

  useEffect(() => {
    if (submissionStatus) {
      setActiveOutputTab('testresult');
    }
  }, [submissionStatus]);

  useEffect(() => {
    if (detailSubmission) {
      setActiveProblemTab('submission');
    }
  }, [detailSubmission]);

  const handleMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChange = (newValue: any) => {
    setCode(newValue);
  };

  const handleDragHeight = (_event: any, info: any) => {
    const newHeight = mHeight.get() + info.delta.y;
    if (newHeight > 0 && newHeight < (window.innerHeight * 75) / 100) {
      mHeight.set(newHeight);
      outputHeight.set(window.innerHeight - newHeight - 100);
    }
  };

  const handleDragWidth = (_event: any, info: any) => {
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

  const handleRefactor = async (currentCode: string, currentLang: string) => {
    try {
      setIsRefactoring(true);
      setOriginalCode(currentCode);
      const response = await refactorCode({
        problemId: problem._id,
        code: currentCode,
        lang: currentLang
      });

      if (response.success && response.data?.refactoredCode) {
        setRefactoredCode(response.data.refactoredCode);
        setShowDiff(true);
        message.success('Code refactored successfully');
      }
    } catch (error) {
      message.error('Failed to refactor code');
      console.error('Error refactoring code:', error);
    } finally {
      setIsRefactoring(false);
    }
  };

  const handleAcceptRefactor = () => {
    setCode(refactoredCode);
    setShowDiff(false);
    message.success('Refactored code applied');
  };

  const handleCancelRefactor = () => {
    setShowDiff(false);
    setRefactoredCode('');
  };

  return {
    editorRef,
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
    originalCode,
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
  };
};
