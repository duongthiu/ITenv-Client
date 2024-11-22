import { Form, Typography } from 'antd';
import Input from 'antd/es/input/Input';
import { useState } from 'react';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { login } from '../../services/authentication.service';
import { notifyError } from '../../utils/helpers/notify';
import { useAuth } from '../../utils/hooks/useAuth.hook';
import { AuthenticationProps } from './Authentication.page';
import useSelection from 'antd/es/table/hooks/useSelection';
import { useSelector } from 'react-redux';
import { useAppSelector } from '../../redux/app/hook';

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
  const{user} = useAppSelector(state=> state.user)
  const { onLogin } = useAuth();
  type ParamsLogin = {
    email: string;
    password: string;
  };
  const onSubmit = async (values: ParamsLogin) => {
    setLoginButtonText('Checking...');

    await onLogin(
      () => login({ email: values?.email || '', password: values?.password || '' }),
      {
        email: values.email,
        password: values.password
      },
      () => {
        setLoginButtonText(LOGIN_TEXT);
        onSuccessSubmit();
        
        navigate(paths.home);
      },
      (message: string) => {
        onFailSubmit();
        notifyError(message || 'Login failed, please try again');
        setLoginButtonText(LOGIN_TEXT);
      }
    );
  };

  return (
    <div className="flex flex-col">
      <Typography.Title className="text-center font-mono font-semibold">Login</Typography.Title>
      <Form onFinish={onSubmit}>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input
            type="text"
            className="form-email input-mode"
            name="email"
            placeholder="Email"
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
