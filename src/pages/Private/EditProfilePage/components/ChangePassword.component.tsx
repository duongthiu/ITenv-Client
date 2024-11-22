import { Button, Form, Input, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { getAllAccount, resetPassword } from '../../../../services/authentication.service';
import useSWR from 'swr';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { notifyError, notifySuccess } from '../../../../utils/helpers/notify';
import LoadingPage from '../../../commons/LoadingPage';

const ChangePassword = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState<boolean>(false);
  const [form] = Form.useForm();

  const { data, isLoading: isLoadingAccount } = useSWR('edit-account', getAllAccount);
  const [isLoading, setIsLoading] = useState(!isLoadingAccount);
  const isOwnPrimaryAccount = useMemo(() => {
    return data?.data?.authenWith?.includes(0);
  }, [data?.data?.authenWith]);
  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      notifyError('Password does not match');
      return;
    }
    if (!data?.data?.email) {
      notifyError('Fail to update password');
      return;
    }
    try {
      setIsLoading(true);
      const response = await resetPassword(data?.data?.email, values.password);
      if (response?.success) {
        notifySuccess('Password has been updated successfully');
        form.resetFields();
      } else {
        notifyError('Fail to update password');
      }
      setIsLoading(false);
    } catch (error) {
      notifyError('Fail to update password');
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setIsLoading(!isLoading);
  }, [isLoadingAccount]);
  return (
    <div className="basic-info-wrapper relatve flex h-full w-full flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-[1.8rem] font-semibold">Change Password</h2>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <Spin size="large" />
        </div>
      )}
      {isOwnPrimaryAccount ? (
        <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input
              type={isShowPassword ? 'text' : 'password'}
              placeholder="Password"
              suffix={
                <Button
                  type="link"
                  icon={isShowPassword ? <GoEyeClosed size={20} /> : <GoEye size={20} />}
                  onClick={() => setIsShowPassword((prev) => !prev)}
                />
              }
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                }
              })
            ]}
          >
            <Input
              type={isShowConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              suffix={
                <Button
                  type="link"
                  icon={isShowConfirmPassword ? <GoEyeClosed size={20} /> : <GoEye size={20} />}
                  onClick={() => setIsShowConfirmPassword((prev) => !prev)}
                />
              }
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="w-fit self-end">
            <Button type="primary" htmlType="submit" className="w-full">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p className="text-[1.6rem] text-red-500">You don't have an account with a password</p>
      )}
    </div>
  );
};

export default ChangePassword;
