import { Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { register } from '../../services/authentication.service';
import { AuthenticationProps } from './Authentication.page';

const LOGIN_TEXT = 'Sign Up';

const SignupForm = () => {
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
  // const [inforSignup, setInforSignup] = useState<boolean>(false);
  const [loginButtonText, setLoginButtonText] = useState<string>(LOGIN_TEXT);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState<boolean>(false);

  const onSubmit = async (values: any) => {
    console.log(values);
    if (values.password !== values.confirmPassword) {
      onFailSubmit(); // Show an error for password mismatch
      return;
    }

    setLoginButtonText('Checking...');

    try {
      const response = await register({
        email: values.email,
        username: values.userName,
        password: values.password,
        authenWith: 0
      });
      if (response.success) onSuccessSubmit();
      else onFailSubmit();

      // navigate(paths.inforSignup);
    } catch (error) {
      console.log(error);
      onFailSubmit();
    } finally {
      setLoginButtonText(LOGIN_TEXT);
    }
  };
  // const onChange = (value: any) => {
  //   console.log(value);
  // };
  return (
    <div>
      <Typography.Title className="text-center font-mono font-semibold">Sign Up</Typography.Title>

      <Form onFinish={onSubmit}>
        <div className="w-full">
          <Form.Item
            name={'userName'}
            rules={[{ required: true, message: 'Please input your user name!' }]}
            className="flex-1"
          >
            <Input
              type="text"
              className="form-username input-mode w-full"
              name="userName"
              placeholder="User name"
              value={usernameValue}
              onChange={onUsernameChange}
              onFocus={onUsernameFocus}
              onBlur={onUserNameBlur}
              // ref={usernameRef}
            />
          </Form.Item>

          <Form.Item name={'email'} rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input
              type="text"
              className="form-email input-mode"
              name="email"
              placeholder="Email"
              value={usernameValue}
              onChange={onUsernameChange}
              onFocus={onUsernameFocus}
              onBlur={onUserNameBlur}
            />
          </Form.Item>
          <Form.Item name={'password'} rules={[{ required: true, message: 'Please input your password!' }]}>
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

          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: 'Please input your Confirm Password!' }]}
          >
            {/* <Input
              type="confirmPassword"
              className="form-pass"
              name="confirmPassword"
              placeholder="Confirm Password "
              onFocus={() => setIsHandUp(true)}
              onBlur={() => setIsHandUp(false)}
            /> */}

            <div className="input-mode flex items-center pr-5">
              <Input
                type={isShowConfirmPassword ? 'text' : 'password'}
                className="form-pass bg-transparent"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={isShowConfirmPassword ? onUsernameChange : undefined}
                onFocus={() => !isShowConfirmPassword && setIsHandUp(true)}
                onBlur={() => setIsHandUp(false)}
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
        </div>
        {/* <div className="mb-5 flex w-full justify-start">
          <ReCAPTCHA sitekey={import.meta.env.VITE_APP_GOOGLE_RECAPCHA_KEY} onChange={onChange} />
        </div> */}
        <button className="login-btn" type="submit">
          {loginButtonText}
        </button>
      </Form>
      <div className="flex items-center gap-1">
        <Typography.Text className="opacity-65">Have an account ? </Typography.Text>
        <Typography.Link onClick={() => navigate(paths.login)}>Login</Typography.Link>
      </div>
    </div>
  );
};

export default SignupForm;
