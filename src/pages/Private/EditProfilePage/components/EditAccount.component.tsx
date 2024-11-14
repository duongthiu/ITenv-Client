// src/components/AccountSettings.tsx
import { DisconnectOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Typography } from 'antd';
import React from 'react';
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../redux/app/hook';
import useSWR from 'swr';
import { getAllAccount } from '../../../../services/authentication.service';

const { Item } = Form;
const socialNetwork = [
  {
    key: 1,
    icon: (
      <div className="cursor-pointer rounded-full bg-[#ea4335] p-2 duration-200">
        <FaGoogle size={18} className="text-white" />
      </div>
    ),
    name: 'Google'
  },
  {
    key: 2,
    icon: (
      <div className="flex cursor-pointer items-center justify-center rounded-full bg-blue-500 p-2 duration-200">
        <FaFacebook size={18} className="text-white" />
      </div>
    ),
    name: 'Facebook'
  },
  {
    key: 3,
    icon: (
      <div className="cursor-pointer rounded-full bg-black p-2 duration-200">
        <FaGithub size={18} className="text-white" />
      </div>
    ),
    name: 'Github'
  }
];
const AccountSettings: React.FC = () => {
  const [form] = Form.useForm();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };
  const { data, isLoading } = useSWR('edit-account', getAllAccount);
  console.log(data);

  return (
    <div className="basic-info-wrapper container mx-auto p-4">
      <h2 className="mb-4 text-[1.8rem] font-semibold">Account Settings</h2>

      {/* Account Information */}
      <div className="mb-6">
        <h3 className="mb-8 text-start text-[1.6rem] font-semibold">Account Information</h3>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Item name="email" label="Email" initialValue={data?.data?.[0]?.email}>
            <Input disabled />
          </Item>
          <p className="text-start font-semibold">Password</p>

          <Button className="p-0" onClick={() => navigate('/edit-profile/change-password')} type="link">
            Change Password
          </Button>
        </Form>
      </div>

      <Divider />

      {/* Social Account */}
      <div className="mb-6">
        <h3 className="mb-8 text-start text-[1.6rem] font-semibold">Social Account</h3>
        <div className="grid grid-cols-1 gap-4">
          {socialNetwork?.map((social) => (
            <div className="flex items-center justify-between">
              {social.icon}
              <Typography.Text>
                {social.name}: {data?.data?.authenWith?.includes(social.key) ? 'Connected' : 'Not Connected'}
              </Typography.Text>
              {data?.data?.authenWith?.includes(social.key) ? (
                <Button icon={<DisconnectOutlined />} type="link">
                  Disconnect
                </Button>
              ) : (
                <Button icon={<LinkOutlined />} type="link">
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Divider />
      <div>
        <Button type="primary" danger>
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
