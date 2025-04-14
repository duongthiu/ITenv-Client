import { Form, Input, Select, Radio, Typography } from 'antd';
import { TagType } from '../../types/TagType';
import { EnumLevelProblem } from '../../types/enum/schemaProblem.enum';
import TextEditorComponent from '../TextEditor/TextEditor.component';
import { ImageType } from '../../types/common';
import './index.style.scss';

const { Text } = Typography;

interface ProblemDetailsProps {
  tags: TagType[];
  description: string;
  setDescription: (content: string) => void;
  postImages: ImageType[];
  setPostImages: (images: ImageType[]) => void;
}

const ProblemDetails: React.FC<ProblemDetailsProps> = ({
  tags,
  description,
  setDescription,
  postImages,
  setPostImages
}) => {
  return (
    <div className="space-y-4">
      <Form.Item
        name="title"
        label={<Text strong>Problem Title</Text>}
        rules={[{ required: true, message: 'Please input the problem title!' }]}
      >
        <Input placeholder="e.g., Two Sum" />
      </Form.Item>

      <Form.Item
        name="level"
        label={<Text strong>Difficulty Level</Text>}
        rules={[{ required: true, message: 'Please select the difficulty level!' }]}
      >
        <Radio.Group>
          <Radio.Button value={EnumLevelProblem.LEVEL_EASY} className="text-green-500">
            <Text>Easy</Text>
          </Radio.Button>
          <Radio.Button value={EnumLevelProblem.LEVEL_MEDIUM} className="text-yellow-500">
            <Text>Medium</Text>
          </Radio.Button>
          <Radio.Button value={EnumLevelProblem.LEVEL_HARD} className="text-red-500">
            <Text>Hard</Text>
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="tags"
        label={<Text strong>Tags</Text>}
        rules={[{ required: true, message: 'Please input at least one tag!' }]}
      >
        <Select mode="tags" placeholder="Please select tags">
          {tags
            .filter((tag) => tag.type === 'Problem')
            .map((tag) => (
              <Select.Option key={tag._id} value={tag._id}>
                <Text>{tag.name}</Text>
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="content"
        label={<Text strong>Problem Description</Text>}
        className="editor-wrapper"
        rules={[{ required: true, message: 'Please input the problem content!' }]}
      >
        <TextEditorComponent
          keyEditor="problem-description"
          content={description}
          setContent={setDescription}
          postImages={postImages}
          setPostImages={setPostImages}
        />
      </Form.Item>

      <Form.Item
        name="exampleTestcases"
        label={<Text strong>Examples</Text>}
        rules={[{ required: true, message: 'Please input example test cases!' }]}
      >
        <Input.TextArea rows={4} placeholder="Provide example inputs and expected outputs." />
      </Form.Item>
    </div>
  );
};

export default ProblemDetails;
