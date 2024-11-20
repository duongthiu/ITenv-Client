import { Skeleton } from 'antd';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import CodeEditor from '../../../components/CodeEditor/CodeEditor';
import {
  getSingleProblem,
  getSubmissionDetail,
  runCode,
  submitCode,
  submitCodeQueryOptions
} from '../../../services/problem/problem.service';
import { cn } from '../../../utils/helpers/cn';
import HeaderComponent from './components/Header.component';
import { useEffect, useState } from 'react';
import { InitialCode, RunCodeResultType, SubmissionDetailType, SubmissionStatusType } from '../../../types/ProblemType';
import { notifyError } from '../../../utils/helpers/notify';
const EditorPage = () => {
  const { slug } = useParams();
  const { data: singleProblem, isLoading } = useSWR('/api/problem/' + slug, () => getSingleProblem(slug || ''));
  const [initCode, setInitCode] = useState<InitialCode | null>(singleProblem?.data?.initialCode[0] || null);
  const [code, setCode] = useState<string>(singleProblem?.data?.initialCode[0].code || '');
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isRunCodeLoading, setIsRunCodeLoading] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatusType | RunCodeResultType>();
  const [detailSubmission, setDetailSubmission] = useState<SubmissionDetailType>();

  useEffect(() => {
    if (singleProblem?.data?.initialCode) {
      setInitCode(singleProblem?.data?.initialCode[0]);
      setCode(singleProblem?.data?.initialCode[0].code);
    }
  }, [singleProblem?.data?.initialCode]);
  const handleSubmitCode = async () => {
    console.log(code);
    console.log(initCode?.lang);
    setIsSubmitLoading(true);
    const submitCodeQueryOptions: submitCodeQueryOptions = {
      lang: initCode!.langSlug!,
      question_id: singleProblem!.data!.questionId,
      typed_code: code
    };
    try {
      const result = await submitCode(slug!, submitCodeQueryOptions);
      if (result.success) {
        if (!result?.data?.run_success) {
          setSubmissionStatus(result.data!);
        }
        const detailSubmission = await getSubmissionDetail(result?.data?.submission_id || '');
        if (detailSubmission.success) {
          setDetailSubmission(detailSubmission.data!);
        } else notifyError('Failed to get submission detail');
      } else notifyError('Failed to submit code');
      setIsSubmitLoading(false);
    } catch (error) {
      setIsSubmitLoading(false);
    }
  };
  const handleRunCode = async () => {
    setIsRunCodeLoading(true);
    const submitCodeQueryOptions: submitCodeQueryOptions & { data_input: string } = {
      lang: initCode!.langSlug!,
      question_id: singleProblem!.data!.questionId,
      typed_code: code,
      data_input: singleProblem!.data!.exampleTestcases || ''
    };
    try {
      const result = await runCode(slug!, submitCodeQueryOptions);
      if (result.success) {
        setSubmissionStatus(result.data!);
      } else notifyError('Failed to submit code');
      setIsRunCodeLoading(false);
    } catch (error) {
      setIsRunCodeLoading(false);
    }
  };
  return (
    <div className={cn('')}>
      <HeaderComponent
        isSubmitLoading={isSubmitLoading}
        handleSubmitCode={handleSubmitCode}
        isRunLoading={isRunCodeLoading}
        handleRunCode={handleRunCode}
      />
      <div className="h-full w-full p-3 pt-0">
        {isLoading ? (
          <Skeleton active />
        ) : singleProblem?.data ? (
          <CodeEditor
            submissionStatus={submissionStatus}
            detailSubmission={detailSubmission}
            initCode={initCode!}
            code={code!}
            setCode={setCode}
            setInitCode={setInitCode}
            problem={singleProblem?.data}
          />
        ) : null}
      </div>
    </div>
  );
};

export default EditorPage;
