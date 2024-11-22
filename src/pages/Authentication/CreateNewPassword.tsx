import { Form, Input, Typography } from 'antd';
import React, { ChangeEvent, useState } from 'react';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { resetPassword } from '../../services/authentication.service';
import { notifyError, notifySuccess } from '../../utils/helpers/notify';

const LOGIN_TEXT = 'Reset My Password';

type CreateNewPasswordProps = {
  email: string;
  onUsernameFocus?: () => void;
  onSuccessSubmit?: () => void;
  onFailSubmit?: () => void;
  setIsHandUp?: (value: boolean) => void;
  onUsernameChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  usernameRef?: React.RefObject<any>;
  usernameValue?: string;
  onUserNameBlur?: () => void;
};
const CreateNewPassword: React.FC<CreateNewPasswordProps> = ({
  email,
  setIsHandUp,
  onUsernameChange,
  onFailSubmit,
  onSuccessSubmit
}) => {
  const [loginButtonText, setLoginButtonText] = useState<string>(LOGIN_TEXT);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const onSubmit = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      notifyError('Password does not match');
      onFailSubmit && onFailSubmit();
      return;
    }
    try {
      setLoginButtonText('Checking...');
      const response = await resetPassword(email, values.password);
      if (response?.success) {
        notifySuccess('Password has been updated successfully');
        onSuccessSubmit && onSuccessSubmit();
        navigate(paths.login);
      } else {
        notifyError('Fail to update password');
        onFailSubmit && onFailSubmit();
      }
      setLoginButtonText(LOGIN_TEXT);
    } catch (error) {
      notifyError('Fail to update password');
      onFailSubmit && onFailSubmit();
      setLoginButtonText(LOGIN_TEXT);
    }
  };
  return (
    <div className="flex flex-col">
      <Typography.Title className="z-10 text-center font-mono font-semibold">Password Reset</Typography.Title>
      <Form onFinish={onSubmit} className="z-10">
        <Form.Item name={'password'} rules={[{ required: true, message: 'Please input your password!' }]}>
          <div className="input-mode flex items-center pr-5">
            <Input
              type={isShowPassword ? 'text' : 'password'}
              className="form-pass bg-transparent"
              name="password"
              placeholder="Password"
              onChange={isShowPassword ? onUsernameChange : undefined}
              onFocus={() => !isShowPassword && setIsHandUp && setIsHandUp(true)}
              onBlur={() => setIsHandUp && setIsHandUp(false)}
            />
            <div
              className="cursor-pointer opacity-60"
              onClick={() => {
                setIsShowPassword(!isShowPassword);
              }}
            >
              {isShowPassword ? <GoEyeClosed size={20} /> : <GoEye size={20} />}
            </div>
          </div>
        </Form.Item>

        <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Please input your Confirm Password!' }]}>
          <div className="input-mode flex items-center pr-5">
            <Input
              type={isShowConfirmPassword ? 'text' : 'password'}
              className="form-pass bg-transparent"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={isShowConfirmPassword ? onUsernameChange : undefined}
              onFocus={() => !isShowConfirmPassword && setIsHandUp && setIsHandUp(true)}
              onBlur={() => setIsHandUp && setIsHandUp(false)}
            />
            <div
              className="cursor-pointer opacity-60"
              onClick={() => {
                setIsShowConfirmPassword(!isShowConfirmPassword);
              }}
            >
              {isShowConfirmPassword ? <GoEyeClosed size={20} /> : <GoEye size={20} />}
            </div>
          </div>
        </Form.Item>

        <button className="login-btn" type="submit">
          {loginButtonText}
        </button>
      </Form>
    </div>
  );
};

export default CreateNewPassword;
