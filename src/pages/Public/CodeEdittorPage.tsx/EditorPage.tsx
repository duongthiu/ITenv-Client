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
import { InitialCode, RunCodeResultType, SubmissionDetailType } from '../../../types/ProblemType';
import { notifyError } from '../../../utils/helpers/notify';
import { useAppSelector } from '../../../redux/app/hook';
const EditorPage = () => {
  const { user, isLogged } = useAppSelector((state) => state.user);
  const { slug } = useParams();
  const { data: singleProblem, isLoading } = useSWR('/api/problem/' + slug, () => getSingleProblem(slug || ''));
  const [initCode, setInitCode] = useState<InitialCode | null>(singleProblem?.data?.initialCode[0] || null);
  const [code, setCode] = useState<string>(singleProblem?.data?.initialCode[0].code || '');
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isRunCodeLoading, setIsRunCodeLoading] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<RunCodeResultType>();
  const [detailSubmission, setDetailSubmission] = useState<SubmissionDetailType>();
  const [isDetail, setIsDetail] = useState<boolean>(false);
  useEffect(() => {
    console.log(singleProblem);
    if (singleProblem?.data?.initialCode) {
      setInitCode(singleProblem?.data?.initialCode[0]);
      setCode(singleProblem?.data?.initialCode[0].code);
    }
  }, [singleProblem?.data?.initialCode]);
  useEffect(() => {
    setSubmissionStatus(undefined);
    setDetailSubmission(undefined);
    setIsDetail(false);
  }, [slug]);
  const handleSubmitCode = async () => {
    if (!user || !isLogged) {
      notifyError('Please login to use this feature');
      return;
    }
    setIsSubmitLoading(true);
    const submitCodeQueryOptions: submitCodeQueryOptions = {
      lang: initCode!.langSlug!,
      typed_code: code
    };
    try {
      const result = await submitCode(slug!, submitCodeQueryOptions);
      if (result.success) {
        if (!result?.data?.run_success) {
          setSubmissionStatus(result.data!);
        }
        const detailSubmission = await getSubmissionDetail(result?.data?.submission_id || '');
        // if (detailSubmission?.success && !detailSubmission.data?.compile_error) {
        //   setDetailSubmission(detailSubmission.data!);
        // }
        setDetailSubmission(detailSubmission.data!);
      }
      const detailSubmission = await getSubmissionDetail(result?.data?.submission_id || '');

      setDetailSubmission(detailSubmission.data!);
      setIsDetail(true);
      setIsSubmitLoading(false);
    } catch (error) {
      setIsSubmitLoading(false);
    }
  };
  const handleRunCode = async () => {
    if (!user || !isLogged) {
      notifyError('Please login to use this feature');
      return;
    }
    setIsRunCodeLoading(true);
    const submitCodeQueryOptions: submitCodeQueryOptions = {
      lang: initCode!.langSlug!,
      typed_code: code
    };
    try {
      const result = await runCode(slug!, submitCodeQueryOptions);
      if (result.success) {
        setSubmissionStatus(result.data!);
      } else notifyError('Failed to submit code');
      setIsRunCodeLoading(false);
    } catch (error) {
      setIsRunCodeLoading(false);
      notifyError('Failed to run code');
    }
  };
  const handleSubmissionSelect = (submission: SubmissionDetailType) => {
    setDetailSubmission(submission);
    setIsDetail(false);
    setCode(submission.code.content);
    if (initCode) {
      setInitCode({
        ...initCode,
        lang: submission.code.language,
        langSlug: submission.code.language.toLowerCase(),
        code: submission.code.content
      });
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
            onSubmissionSelect={handleSubmissionSelect}
            isDetail={isDetail}
            setIsDetail={setIsDetail}
          />
        ) : null}
      </div>
    </div>
  );
};

export default EditorPage;
