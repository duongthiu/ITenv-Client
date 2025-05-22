import { Form, Typography, Tabs, Modal, Input, message } from 'antd';
import MonacoEditor from '@monaco-editor/react';
import { useState, MouseEvent, KeyboardEvent } from 'react';

const { Text } = Typography;

interface Template {
  id: string;
  language: string;
  code: string;
}

const defaultTemplates: Template[] = [
  {
    id: 'javascript',
    language: 'javascript',
    code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solution(nums, target) {
    // Write your solution here
    
}`
  }
];

const SolutionTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ language: '', code: '' });
  const [form] = Form.useForm();

  // Create initial values object from templates
  const initialValues = templates.reduce(
    (acc, template) => ({
      ...acc,
      [`${template.id}Code`]: template.code
    }),
    {}
  );

  const handleAddTemplate = () => {
    if (newTemplate.language && newTemplate.code) {
      const template: Template = {
        id: newTemplate.language.toLowerCase(),
        language: newTemplate.language,
        code: newTemplate.code
      };
      setTemplates([...templates, template]);
      setIsModalVisible(false);
      setNewTemplate({ language: '', code: '' });
    }
  };

  const handleTabChange = (key: string) => {
    const template = templates.find((t) => t.id === key);
    if (template) {
      form.setFieldValue(`${template.id}Code`, template.code);
    }
  };

  const handleEdit = (e: string | MouseEvent<Element> | KeyboardEvent, action: 'add' | 'remove') => {
    if (action === 'add') {
      setIsModalVisible(true);
    } else if (action === 'remove' && typeof e === 'string') {
      const template = templates.find((t) => t.id === e);
      if (template && defaultTemplates.some((t) => t.id === e)) {
        message.warning('Cannot delete default templates');
        return;
      }
      Modal.confirm({
        title: 'Delete Template',
        content: `Are you sure you want to delete the ${template?.language} template?`,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          setTemplates(templates.filter((t) => t.id !== e));
          form.setFieldValue(`${e}Code`, undefined);
        }
      });
    }
  };

  return (
    <Form form={form} className="space-y-4" initialValues={initialValues}>
      <Tabs
        type="editable-card"
        onChange={handleTabChange}
        onEdit={handleEdit}
        items={templates.map((template) => ({
          key: template.id,
          label: <Text strong>{template.language}</Text>,
          closable: !defaultTemplates.some((t) => t.id === template.id),
          children: (
            <Form.Item
              name={`${template.id}Code`}
              rules={[{ required: true, message: `Please provide ${template.language} solution!` }]}
            >
              <MonacoEditor height="300px" language={template.language} theme="vs-dark" />
            </Form.Item>
          )
        }))}
      />

      <Modal
        title={<Text strong>Add New Template</Text>}
        open={isModalVisible}
        onOk={handleAddTemplate}
        onCancel={() => setIsModalVisible(false)}
        okText="Add"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <Text strong>Language</Text>
            <Input
              placeholder="e.g., Go, Rust, Kotlin"
              value={newTemplate.language}
              onChange={(e) => setNewTemplate({ ...newTemplate, language: e.target.value })}
            />
          </div>
          <div>
            <Text strong>Template Code</Text>
            <Input.TextArea
              placeholder="Enter the template code"
              value={newTemplate.code}
              onChange={(e) => setNewTemplate({ ...newTemplate, code: e.target.value })}
              rows={10}
            />
          </div>
        </div>
      </Modal>
    </Form>
  );
};

export default SolutionTemplates;
