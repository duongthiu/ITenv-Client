import { Button, Form, Card } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createProblem } from '../../services/problem/problem.service';
import { getTags } from '../../services/tags/tag.service';
import { CreateProblemRequest } from '../../services/problem/problem.service';
import Header from '../../components/CommonAdmin/Header';
import { useEffect, useState } from 'react';
import { TagType } from '../../types/TagType';
import { ImageType } from '../../types/common';
import { ProblemDetails, TestCases, SolutionTemplates } from '../../components/Problem';

interface TestCase {
  id: string;
  inputs: Array<{ id: string; name: string; value: string; type: string }>;
  output: {
    value: string;
    type: string;
  };
  isHidden: boolean;
}

const CreateProblemPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: crypto.randomUUID(),
      inputs: [{ id: crypto.randomUUID(), name: '', value: '', type: 'string' }],
      output: { value: '', type: 'string' },
      isHidden: false
    }
  ]);
  const [description, setDescription] = useState('');
  const [postImages, setPostImages] = useState<ImageType[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        if (response.data) {
          setTags(response.data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  const addTestCase = () => {
    const newTestCase = {
      id: crypto.randomUUID(),
      inputs: [{ id: crypto.randomUUID(), name: '', value: '', type: 'string' }],
      output: { value: '', type: 'string' },
      isHidden: false
    };
    setTestCases([...testCases, newTestCase]);
  };

  const removeTestCase = (id: string) => {
    if (testCases.length <= 1) {
      return; // Prevent deletion if there's only one test case
    }
    setTestCases(testCases.filter((testCase) => testCase.id !== id));
  };

  const addInput = (testCaseId: string) => {
    setTestCases(
      testCases.map((testCase) => {
        if (testCase.id === testCaseId) {
          return {
            ...testCase,
            inputs: [...testCase.inputs, { id: crypto.randomUUID(), name: '', value: '', type: 'string' }]
          };
        }
        return testCase;
      })
    );
  };

  const removeInput = (testCaseId: string, inputId: string) => {
    setTestCases(
      testCases.map((testCase) => {
        if (testCase.id === testCaseId) {
          return {
            ...testCase,
            inputs: testCase.inputs.filter((input) => input.id !== inputId)
          };
        }
        return testCase;
      })
    );
  };

  const updateInput = (testCaseId: string, inputId: string, field: 'name' | 'value' | 'type', value: string) => {
    setTestCases(
      testCases.map((testCase) => {
        if (testCase.id === testCaseId) {
          return {
            ...testCase,
            inputs: testCase.inputs.map((input) => {
              if (input.id === inputId) {
                return { ...input, [field]: value };
              }
              return input;
            })
          };
        }
        return testCase;
      })
    );
  };

  const updateTestCase = (
    testCaseId: string,
    field: 'output' | 'isHidden',
    value: { value: string; type: string } | boolean
  ) => {
    setTestCases(
      testCases.map((testCase) => {
        if (testCase.id === testCaseId) {
          if (field === 'output') {
            return { ...testCase, output: value as { value: string; type: string } };
          }
          return { ...testCase, isHidden: value as boolean };
        }
        return testCase;
      })
    );
  };

  const handleCreateProblem = async (values: any) => {
    console.log(values);
    try {
      setLoading(true);
      const problemData: CreateProblemRequest = {
        ...values,
        testCase: testCases.map((testCase) => ({
          input: testCase.inputs.map((input) => ({
            name: input.name,
            value: input.value,
            type: input.type
          })),
          output: testCase.output,
          isHidden: testCase.isHidden
        })),
        initialCode: [
          {
            lang: 'javascript',
            langSlug: 'javascript',
            code: values.javascriptCode || ''
          },
          {
            lang: 'python',
            langSlug: 'python',
            code: values.pythonCode || ''
          },
          {
            lang: 'java',
            langSlug: 'java',
            code: values.javaCode || ''
          },
          {
            lang: 'cpp',
            langSlug: 'cpp',
            code: values.cppCode || ''
          }
        ]
      };
      await createProblem(problemData);
      navigate('/admin/problems');
    } catch (error) {
      console.error('Error creating problem:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 h-full flex-1 overflow-auto">
      <Header title="Create Problem" />
      <main className="lg:px-8 h-full px-4 py-6">
        <Form form={form} layout="vertical" onFinish={handleCreateProblem}>
          <motion.div
            className="grid grid-cols-8 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Left Column - Problem Details */}
            <div className="col-span-5 space-y-6">
              <Card title="Problem Details" className="rounded-xl shadow-lg">
                <ProblemDetails
                  tags={tags}
                  description={description}
                  setDescription={(content) => {
                    setDescription(content);
                    form.setFieldValue('content', content);
                  }}
                  postImages={postImages}
                  setPostImages={setPostImages}
                />
              </Card>
            </div>

            {/* Right Column - Test Cases and Solution Templates */}
            <div className="col-span-3 space-y-6">
              <Card title="Test Cases" className="rounded-xl shadow-lg">
                <TestCases
                  testCases={testCases}
                  addTestCase={addTestCase}
                  removeTestCase={removeTestCase}
                  addInput={addInput}
                  removeInput={removeInput}
                  updateInput={updateInput}
                  updateTestCase={updateTestCase}
                />
              </Card>

              <Card title="Solution Templates" className="h-[450px] flex-auto overflow-y-auto rounded-xl shadow-lg">
                <SolutionTemplates />
              </Card>

              <div className="flex justify-end space-x-4">
                <Button onClick={() => navigate('/admin/problems')}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Create Problem
                </Button>
              </div>
            </div>
          </motion.div>
        </Form>
      </main>
    </div>
  );
};

export default CreateProblemPage;
