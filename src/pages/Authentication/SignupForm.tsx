import { Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { confirmSignup, confirmSignupType, register, RegisterType } from '../../services/authentication.service';
import { AuthenticationProps } from './Authentication.page';
import OTPModal from './components/OTPModal.component';
import { AnimatePresence, motion } from 'framer-motion';
import { notifyError, notifySuccess } from '../../utils/helpers/notify';
import LoadingPage from '../commons/LoadingPage';

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
  const [isShowOtp, setIsShowOtp] = useState<boolean>(false);
  const [signUpInfo, setSignUpInfo] = useState<RegisterType>();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      notifyError('Password does not match');
      onFailSubmit(); // Show an error for password mismatch
      return;
    }

    setLoginButtonText('Checking...');

    try {
      setIsLoading(true);

      const response = await register({
        email: values.email,
        username: values.userName,
        password: values.password,
        authenWith: 0
      });
      if (response.success) {
        setSignUpInfo({
          email: values.email,
          username: values.userName,
          password: values.password,
          authenWith: 0
        });
        onSuccessSubmit();
        setIsShowOtp(true);
        setIsLoading(false);
      } else {
        onFailSubmit();
        notifyError(response?.message);
      }
      // navigate(paths.inforSignup);
    } catch (error) {
      console.log(error);
      notifyError((error as any).response?.data?.message);
      onFailSubmit();
    } finally {
      setIsLoading(false);
      setLoginButtonText(LOGIN_TEXT);
    }
  };
  // const onChange = (value: any) => {
  //   console.log(value);
  // };
  const handleConfirmOTP = async (otpCode: string) => {
    if (signUpInfo) {
      const confirmData: confirmSignupType = {
        email: signUpInfo.email,
        username: signUpInfo.username,
        password: signUpInfo.password,
        authenWith: signUpInfo.authenWith,
        otp: otpCode
      };

      try {
        setIsLoading(true);
        const response = await confirmSignup(confirmData);
        if (response.success) {
          // Handle success (e.g., redirect or show success message)
          notifySuccess('Signup confirmed successfully');
          navigate(paths.login);
        } else {
          notifyError('Failed to confirm signup');
          onFailSubmit(); // Handle failure
        }
        setIsLoading(false);
      } catch (error) {
        notifyError('Failed to confirm signup');
        onFailSubmit(); // Handle error
        setIsLoading(false);
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  return (
    <div>
      {isLoading && <LoadingPage />}
      <AnimatePresence mode="wait">
        {isShowOtp && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
            onClick={(e) => e.stopPropagation()} // Prevent modal click from closing it
          >
            <div className="fixed z-20">
              <OTPModal setIsShowOtp={setIsShowOtp} onSubmit={handleConfirmOTP} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* {isShowOtp && (
      
      )} */}
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
