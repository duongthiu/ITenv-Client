import { Button, Form, Input, Select, Spin } from 'antd';
import React, { useState } from 'react';
import useSWR from 'swr';
import { QueryOptions } from '../../types/common';
import { getAllUser } from '../../services/user/user.admin.service';

const { TextArea } = Input;
const { Option } = Select;

// Example usage with mock data
const Notifications = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: { title: string; content: string; recipients: string[] }) => {
    console.log('Form Submitted: ', values);
    // Handle the notification sending logic here (e.g., API call)
  };

  const [queryOptions, setQueryOptions] = useState<QueryOptions>({
    page: 1,
    pageSize: 10,
    search: ''
  });

  const {
    data: userData,
    isValidating,
    mutate
  } = useSWR(`users-notify-${JSON.stringify(queryOptions)}`, () => getAllUser(queryOptions), {
    revalidateOnFocus: false
  });

  const users = userData?.data || [];
  const totalUsers = userData?.total || 0;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryOptions({ ...queryOptions, search: e.target.value, page: 1 });
  };

  const handleLoadMore = () => {
    if (users.length < totalUsers) {
      setQueryOptions((prev) => ({ ...prev, page: prev.page! + 1 }));
    }
  };

  return (
    <div className="basic-info-wrapper flex h-full w-full flex-col items-center justify-center p-4">
      <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto">
        <div className="lex h-full w-full flex-col items-center justify-center p-6">
          <h2 className="mb-6 text-start text-[1.8rem] font-semibold">Send Notifications</h2>
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <Form.Item
              label={<span className="text-[1.6rem]">Title</span>}
              name="title"
              rules={[{ required: true, message: 'Please input the title!' }]}
            >
              <Input placeholder="Enter notification title" />
            </Form.Item>

            {/* Content Input */}
            <Form.Item
              label={<span className="text-[1.6rem]">Content</span>}
              name="content"
              rules={[{ required: true, message: 'Please input the content!' }]}
            >
              <TextArea rows={4} placeholder="Enter notification content" />
            </Form.Item>

            <Form.Item label={<span className="text-[1.6rem]">Recipients</span>} name="recipients">
              <Select mode="multiple" placeholder="Select recipients">
                {userData?.data?.map((user) => (
                  <Option key={user._id} value={user._id}>
                    {user.user?.username}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" className="mt-10 w-full">
                Send Notification
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
