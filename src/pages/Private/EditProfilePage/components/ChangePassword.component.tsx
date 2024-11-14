import { Button, Form, Input } from 'antd';
import React from 'react';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };
  return (
    <div className="basic-info-wrapper flex h-full w-full flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-[1.8rem] font-semibold">Change Password</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input placeholder="Password" />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: 'Please input your confirm password!' }]}
        >
          <Input placeholder="Password" />
        </Form.Item>
        <Form.Item className="w-fit self-end">
          <Button type="primary" htmlType="submit" className="w-full">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
