import { Button, DatePicker, Form, Input, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/app/hook';
import { setUser } from '../../../../redux/user/user.slice';
import { updateProfile } from '../../../../services/user/user.service';
import { EnumGengerUser } from '../../../../types/enum/GenderEnum.enum';
import { notifyError, notifySuccess } from '../../../../utils/helpers/notify';

const { Option } = Select;

const BasicInfo: React.FC = () => {
  const { user } = useAppSelector((state) => state.user); // Accessing user data from Redux
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        dob: user.dob ? dayjs(user.dob) : null,
        gender:
          user.gender === EnumGengerUser.GENDER_MALE
            ? 'Male'
            : user.gender === EnumGengerUser.GENDER_FEMALE
              ? 'Femail'
              : 'Other',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      const response = await updateProfile({
        username: values.username,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : '',
        gender: values.gender,
        phoneNumber: values.phoneNumber
      });

      if (response && response.success) {
        setIsLoading(false);
        notifySuccess('Profile updated successfully');
        dispatch(setUser(response.data));
      } else {
        setIsLoading(false);
        notifyError('Failed to update profile');
      }
    } catch (error) {
      setIsLoading(false);
      notifyError('An error occurred while updating your profile');
    }
    // finally {

    // }
  };
  return (
    <div className="basic-info-wrapper flex h-full w-full flex-col items-center justify-center">
      <h2 className="mb-6 text-start text-[1.8rem] font-semibold">Basic Info</h2>
      {isLoading && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.2)]">
          <Spin size="large" />
        </div>
      )}
      <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder={user?.username} />
        </Form.Item>
        <div className="flex w-full gap-10">
          <Form.Item label="Birthday" name="dob" className="flex-[0.7]">
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Form.Item>
          <Form.Item className="flex-[0.3]" label="Gender" name="gender">
            <Select placeholder="Select your gender">
              <Option value={EnumGengerUser.GENDER_MALE}>Male</Option>
              <Option value={EnumGengerUser.GENDER_FEMALE}>Female</Option>
              <Option value={EnumGengerUser.GENDER_OTHER}>Other</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="Phone Number" name="phoneNumber">
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item className="w-fit self-end">
          <Button type="primary" htmlType="submit" className="w-full">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BasicInfo;
