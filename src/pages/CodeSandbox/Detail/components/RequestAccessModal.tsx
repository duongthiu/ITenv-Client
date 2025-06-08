import { Modal, Form, Input, Select, message } from 'antd';
import { requestAccess } from '../../../../services/codesanbox/codesandbox.service';
import './PreviewPanel.style.scss';
import React from 'react';

const { Option } = Select;

interface RequestAccessModalProps {
  sandboxId: string;
  open: boolean;
  onClose: () => void;
}

const RequestAccessModal: React.FC<RequestAccessModalProps> = ({ open, onClose, sandboxId }) => {
  const [form] = Form.useForm();
  const handleRequestSubmit = async (values: { role: 'owner' | 'editor' | 'viewer'; message: string }) => {
    try {
      if (!sandboxId) return;
      await requestAccess(sandboxId, values);
      message.success('Access request submitted successfully');
      onClose();
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to submit access request');
    }
  };
  const handleFinish = (values: any) => {
    handleRequestSubmit(values);
  };

  React.useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <Modal title="Request Access" open={open} onCancel={onClose} footer={null}>
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item name="role" label="Requested Role" rules={[{ required: true, message: 'Please select a role' }]}>
          <Select<'owner' | 'editor' | 'viewer'>>
            <Option value="viewer">Viewer</Option>
            <Option value="editor">Editor</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="message"
          label="Message (Optional)"
          rules={[{ max: 500, message: 'Message cannot exceed 500 characters' }]}
        >
          <Input.TextArea rows={4} placeholder="Explain why you need access to this sandbox" />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              Submit Request
            </button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestAccessModal;
