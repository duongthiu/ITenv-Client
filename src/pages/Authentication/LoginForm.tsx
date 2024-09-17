import { Form, Typography } from 'antd';
import { useState } from 'react';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { AuthenticationProps } from './Authentication.page';
import Input from 'antd/es/input/Input';

const LOGIN_TEXT = 'Login';

const LoginForm = () => {
  const {
    onUsernameFocus,
    onSuccessSubmit,
    onFailSubmit,
    setIsHandUp,
    onUsernameChange,
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
      <Typography.Title className="text-center font-mono font-semibold">Login</Typography.Title>
      <Form onFinish={onSubmit}>
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input
            type="text"
            className="form-username input-mode"
            name="username"
            placeholder="Username"
            value={usernameValue || ''}
            onChange={onUsernameChange}
            onFocus={onUsernameFocus}
            onBlur={onUserNameBlur}
          />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <div className="input-mode flex items-center pr-5">
            <Input
              type={isShowPassword ? 'text' : 'password'}
              className="form-pass bg-transparent"
              name="password"
              placeholder="Password"
              onChange={isShowPassword ? onUsernameChange : undefined}
              onFocus={() => !isShowPassword && setIsHandUp(true)}
              onBlur={() => setIsHandUp(false)}
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
        <button className="login-btn" type="submit">
          {loginButtonText}
        </button>
      </Form>
      <div className="mt-4 flex items-center justify-between">
        <Typography.Link onClick={() => navigate(paths.forgetPassword)}>Forgot password</Typography.Link>
        <Typography.Link onClick={() => navigate(paths.signup)}>Sign up</Typography.Link>
      </div>
    </div>
  );
};

export default LoginForm;
