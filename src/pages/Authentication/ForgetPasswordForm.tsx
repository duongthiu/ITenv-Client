import { Form, Typography } from 'antd';
import { useState } from 'react';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { AuthenticationProps } from './Authentication.page';

const LOGIN_TEXT = 'Reset My Password';

const ForgetPasswordForm = () => {
  const {
    onUsernameFocus,
    onSuccessSubmit,
    onFailSubmit,
    setIsHandUp,
    onUsernameChange,
    usernameRef,
    usernameValue,
    onUserNameBlur
  } = useOutletContext<AuthenticationProps>();

  const navigate = useNavigate();
  const [loginButtonText, setLoginButtonText] = useState<string>(LOGIN_TEXT);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const onSubmit = (values: any) => {
    console.log(values);
    setLoginButtonText('Checking...');
    setTimeout(() => {
      setLoginButtonText(LOGIN_TEXT);
      values.password === '123' ? onSuccessSubmit() : onFailSubmit();
    }, 1500);
  };

  return (
    <div className="flex flex-col">
      <Typography.Title className="text-center font-mono font-semibold">Password Reset</Typography.Title>

      <Form onFinish={onSubmit}>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <input
            type="text"
            className="form-email input-mode"
            name="username"
            placeholder="Email"
            value={usernameValue}
            onChange={onUsernameChange}
            onFocus={onUsernameFocus}
            onBlur={onUserNameBlur}
            ref={usernameRef}
          />
        </Form.Item>

        <button className="login-btn" type="submit">
          {loginButtonText}
        </button>
      </Form>
      <div className="mt-4 flex items-center justify-between">
        <Typography.Link onClick={() => navigate(paths.login)}>Login</Typography.Link>
        <Typography.Link onClick={() => navigate(paths.signup)}>Sign up</Typography.Link>
      </div>
    </div>
  );
};

export default ForgetPasswordForm;
