import { Form, Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { AuthenticationProps } from './Authentication.page';
import OTPModal from './components/OTPModal.component';
import { forgotPassword, verifyOTP } from '../../services/authentication.service';
import { notifyError } from '../../utils/helpers/notify';
import CreateNewPassword from './CreateNewPassword';

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
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [finalStep, setFinalStep] = useState<boolean>(false);

  const onSubmit = async (values: any) => {
    setLoginButtonText('Checking...');
    setIsShowModal(true);
    try {
      const response = await forgotPassword(values.email);
      if (response) {
        setEmail(values.email);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onVerifySubmit = async (otpCode: string) => {
    try {
      const response = await verifyOTP(email, otpCode);
      if (response) {
        onSuccessSubmit();
        setFinalStep(true);
      } else {
        notifyError('Invalid OTP');
        onFailSubmit();
      }
    } catch (error) {
      onFailSubmit();
      notifyError((error as Error).message);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, x: '-80vh' }, // Off-screen initially
    visible: { opacity: 1, x: '0' }, // Slide in
    exit: { opacity: 0, x: '80vh' } // Slide out
  };

  return (
    <div className="flex flex-col">
      {isShowModal && (
        <div
          className="fixed bottom-0 left-0 right-0 top-0 z-20 bg-black bg-opacity-50"
          onClick={() => setIsShowModal(false)}
        ></div>
      )}
      <AnimatePresence mode="wait">
        {isShowModal && (
          <motion.div
            className="z-20"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }} // Optional, controls speed of animation
          >
            <OTPModal setIsShowOtp={setIsShowModal} onSubmit={onVerifySubmit} />
          </motion.div>
        )}
      </AnimatePresence>
      {!finalStep ? (
        <div>
          <Typography.Title className="z-10 text-center font-mono font-semibold">Password Reset</Typography.Title>
          <Form onFinish={onSubmit} className="z-10">
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
      ) : (
        <CreateNewPassword
          email={email}
          setIsHandUp={setIsHandUp}
          onUsernameChange={onUsernameChange}
          onFailSubmit={onFailSubmit}
        />
      )}
    </div>
  );
};

export default ForgetPasswordForm;
