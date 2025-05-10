import React, { useState } from 'react';
import { Modal, Form, Input, Switch, Button, message, Card, Tag } from 'antd';
import { createCodeSandbox } from '../../../services/codesanbox/codesandbox.service';
import { CodeSandboxLanguage } from '../../../types/codesandbox.type';
import { CodeOutlined, Html5TwoTone, PythonOutlined } from '@ant-design/icons';

interface CreateSandboxModalProps {
  open: boolean;
  onClose: () => void;
  mutate: () => void;
}

const GROUPS = [
  {
    key: 'html-css-js',
    label: 'HTML + CSS + JS',
    description: 'Create a project with HTML, CSS, and JavaScript',
    language: [CodeSandboxLanguage.HTML, CodeSandboxLanguage.CSS, CodeSandboxLanguage.JAVASCRIPT],
    icon: <CodeOutlined style={{ fontSize: 28, color: '#faad14' }} />, // group icon
    enabled: true
  }
];

const INDIVIDUAL_LANGUAGES = [
  {
    key: 'html',
    label: 'HTML',
    language: [CodeSandboxLanguage.HTML],
    icon: <Html5TwoTone style={{ fontSize: 28 }} twoToneColor="#e34c26" />,
    enabled: true
  },
  {
    key: 'css',
    label: 'CSS',
    language: [CodeSandboxLanguage.CSS],
    icon: <CodeOutlined style={{ fontSize: 28, color: '#2965f1' }} />,
    enabled: true
  },
  {
    key: 'javascript',
    label: 'JavaScript',
    language: [CodeSandboxLanguage.JAVASCRIPT],
    icon: <CodeOutlined style={{ fontSize: 28, color: '#f7df1e' }} />,
    enabled: true
  },
  {
    key: 'python',
    label: 'Python',
    language: [CodeSandboxLanguage.PYTHON],
    icon: <PythonOutlined style={{ fontSize: 28, color: '#3776ab' }} />,
    enabled: false // disabled for now
  }
  // Add more languages as needed
];

const CreateSandboxModal: React.FC<CreateSandboxModalProps> = ({ open, onClose, mutate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await createCodeSandbox({ ...values, language: selectedLanguages });
      mutate();
      message.success('Code sandbox created successfully');
      onClose();
      form.resetFields();
      setSelectedGroup(null);
      setSelectedLanguages([]);
    } catch (error) {
      message.error('Failed to create code sandbox');
    } finally {
      setLoading(false);
    }
  };

  const handleCardSelect = (key: string, languageArr: string[]) => {
    setSelectedGroup(key);
    setSelectedLanguages(languageArr);
    form.setFieldsValue({ language: languageArr });
  };

  return (
    <Modal
      title="Create New Code Sandbox"
      open={open}
      onCancel={() => {
        onClose();
        setSelectedGroup(null);
        setSelectedLanguages([]);
      }}
      footer={null}
      destroyOnClose
    >
      {!selectedGroup ? (
        <div>
          <div className="mb-4">Select a project type or language:</div>
          <div className="flex flex-wrap gap-4">
            {GROUPS.map((group) => (
              <Card
                key={group.key}
                hoverable={group.enabled}
                onClick={group.enabled ? () => handleCardSelect(group.key, group.language) : undefined}
                style={{
                  width: 180,
                  opacity: group.enabled ? 1 : 0.5,
                  cursor: group.enabled ? 'pointer' : 'not-allowed',
                  textAlign: 'center'
                }}
                bodyStyle={{ padding: 16 }}
              >
                <div className="flex flex-col items-center justify-center">
                  {group.icon}
                  <div className="mb-1 mt-2 font-semibold">{group.label}</div>
                </div>
              </Card>
            ))}
            {INDIVIDUAL_LANGUAGES.map((lang) => (
              <Card
                key={lang.key}
                hoverable={lang.enabled}
                onClick={lang.enabled ? () => handleCardSelect(lang.key, lang.language) : undefined}
                style={{
                  width: 120,
                  opacity: lang.enabled ? 1 : 0.5,
                  cursor: lang.enabled ? 'pointer' : 'not-allowed',
                  textAlign: 'center'
                }}
                bodyStyle={{ padding: 16 }}
              >
                <div className="flex flex-col items-center justify-center">
                  {lang.icon}
                  <div className="mb-1 mt-2 font-semibold">{lang.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isPublic: false
          }}
        >
          {/* <Form.Item label="Project Type">
            <Input
              value={
                GROUPS.find((g) => g.key === selectedGroup)?.label ||
                INDIVIDUAL_LANGUAGES.find((l) => l.key === selectedGroup)?.label
              }
              disabled
            />
          </Form.Item> */}

          <Form.Item label="Languages">
            <div>
              {selectedLanguages.map((lang) => (
                <Tag color="blue" key={lang}>
                  {lang.toUpperCase()}
                </Tag>
              ))}
            </div>
          </Form.Item>
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="isPublic" label="Public Project" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button
                onClick={() => {
                  setSelectedGroup(null);
                  setSelectedLanguages([]);
                  form.resetFields();
                }}
              >
                Back
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default CreateSandboxModal;
