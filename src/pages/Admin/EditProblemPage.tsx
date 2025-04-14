import { Button, Form, Card } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { getProblemById, updateProblem } from '../../services/problem/problem.service';
import { getTags } from '../../services/tags/tag.service';
import { CreateProblemRequest } from '../../services/problem/problem.service';
import Header from '../../components/CommonAdmin/Header';
import { useEffect, useState } from 'react';
import { TagType } from '../../types/TagType';
import { ImageType } from '../../types/common';
import { ProblemDetails, TestCases, SolutionTemplates } from '../../components/Problem';

interface TestCase {
  id: string;
  inputs: Array<{ id: string; name: string; value: string }>;
  output: string;
  isHidden: boolean;
}

const EditProblemPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [description, setDescription] = useState('');
  const [postImages, setPostImages] = useState<ImageType[]>([]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        if (id) {
          const response = await getProblemById(id);
          const problem = response.data;

          // Set form values
          form.setFieldsValue({
            title: problem.title,
            content: problem.content,
            difficulty: problem.difficulty,
            tags: problem.tags
            // ... other form fields
          });

          // Set test cases
          setTestCases(
            problem.testCase.map((tc: any) => ({
              id: crypto.randomUUID(),
              inputs: tc.input.map((input: any) => ({
                id: crypto.randomUUID(),
                name: input.name,
                value: input.value
              })),
              output: tc.output[0],
              isHidden: tc.isHidden
            }))
          );

          // Set description
          setDescription(problem.content);

          // Set solution templates
          problem.initialCode.forEach((code: any) => {
            form.setFieldValue(`${code.langSlug}Code`, code.code);
          });
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

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

    fetchProblem();
    fetchTags();
  }, [id, form]);

  const handleUpdateProblem = async (values: any) => {
    try {
      setLoading(true);
      const problemData: CreateProblemRequest = {
        ...values,
        testCase: testCases.map((testCase) => ({
          input: testCase.inputs.map((input) => ({
            name: input.name,
            value: input.value
          })),
          output: [testCase.output],
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

      if (id) {
        await updateProblem(id, problemData);
        navigate('/admin/problems');
      }
    } catch (error) {
      console.error('Error updating problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTestCase = () => {
    const newTestCase = {
      id: crypto.randomUUID(),
      inputs: [{ id: crypto.randomUUID(), name: '', value: '' }],
      output: '',
      isHidden: false
    };
    setTestCases([...testCases, newTestCase]);
  };

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter((testCase) => testCase.id !== id));
  };

  const addInput = (testCaseId: string) => {
    setTestCases(
      testCases.map((testCase) => {
        if (testCase.id === testCaseId) {
          return {
            ...testCase,
            inputs: [...testCase.inputs, { id: crypto.randomUUID(), name: '', value: '' }]
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

  const updateInput = (testCaseId: string, inputId: string, field: 'name' | 'value', value: string) => {
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

  const updateTestCase = (testCaseId: string, field: 'output' | 'isHidden', value: string | boolean) => {
    setTestCases(
      testCases.map((testCase) => {
        if (testCase.id === testCaseId) {
          return { ...testCase, [field]: value };
        }
        return testCase;
      })
    );
  };

  return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Edit Problem" />
      <main className="lg:px-8 px-4 py-6">
        <Form form={form} layout="vertical" onFinish={handleUpdateProblem}>
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

              <Card title="Solution Templates" className="rounded-xl shadow-lg">
                <SolutionTemplates />
              </Card>

              <div className="flex justify-end space-x-4">
                <Button onClick={() => navigate('/admin/problems')}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Problem
                </Button>
              </div>
            </div>
          </motion.div>
        </Form>
      </main>
    </div>
  );
};

export default EditProblemPage;
