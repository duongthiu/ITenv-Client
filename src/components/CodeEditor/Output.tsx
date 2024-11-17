import { Button, Typography, Card } from 'antd';
import { cn } from '../../utils/helpers/cn';
import React, { useState } from 'react';
import { LangVersionType } from '../../utils/constants/codeLanguage';
// import { executeCode } from '../../apis/executeCode.api';
// import axios from 'axios';
// import { post } from '../../apis';
import { runCode, SubmissionBody, submitCode } from '../../services/testApi.service';

const { Text } = Typography;

type OutputType = {
  editorRef: any;
  language: LangVersionType;
};

const Output: React.FC<OutputType> = React.memo(({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // const runCode = async () => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const sourceCode = editorRef.current.getValue();
  //     if (!sourceCode) return;
  //     const { run: result } = await executeCode(language, sourceCode);
  //     setOutput(result.output);
  //   } catch (error: any) {
  //     setError(error);
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleCompile = async () => {
    try {
      setIsLoading(true);
      // const response = await runCode({ code: editorRef.current.getValue(), language: language.value });
      const submissionBody: SubmissionBody = {
        lang: 'python3',
        question_id: 1,
        typed_code: editorRef.current.getValue()
      };
      const response = await submitCode({
        name: 'two-sum',
        submissionBody
      });
      setOutput(response.data as any);
    } catch (error) {
      setError(error as any);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn('flex h-full flex-col gap-4 overflow-y-auto p-4')}>
      <div className="flex items-center gap-4">
        <Text style={{ marginBottom: '8px', fontSize: 'large' }}>Output</Text>
        <Button type="primary" style={{ marginBottom: '16px' }} loading={isLoading} onClick={handleCompile}>
          Run Code
        </Button>
      </div>
      <Card
        style={{
          // height: '75vh',
          padding: '16px',
          border: '1px solid #333',
          borderRadius: '4px',
          color: '#333'
        }}
      >
        {output || error}
      </Card>
    </div>
  );
});

export default Output;
