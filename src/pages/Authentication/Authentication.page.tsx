/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from 'antd';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FaFacebookF, FaGithub, FaGoogle } from 'react-icons/fa';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Alignment, Fit, Layout, RiveState, StateMachineInput, useRive, useStateMachineInput } from 'rive-react';
import logo from '../../assets/logo/logo.png';
import { paths } from '../../routes/paths';
import './Authentication.style.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { registerWithGithub } from '../../services/authentication.service';
const STATE_MACHINE_NAME = 'Login Machine';
export type AuthenticationProps = {
  onUsernameFocus: () => void;
  onSuccessSubmit: () => void;
  onFailSubmit: () => void;
  setIsHandUp: (value: boolean) => void;
  onUsernameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  usernameRef: React.RefObject<any>;
  usernameValue: string;
  onUserNameBlur: () => void;
};
const AuthenticationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { rive: riveInstance, RiveComponent }: RiveState = useRive({
    src: 'src/assets/login-teddy.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center
    })
  });
  const [userValue, setUserValue] = useState('');
  // const [inputLookMultiplier, setInputLookMultiplier] = useState(0);

  const isCheckingInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'isChecking'
  );
  const numLookInput: StateMachineInput | null = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'numLook');
  const trigSuccessInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'trigSuccess'
  );
  const trigFailInput: StateMachineInput | null = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'trigFail');
  const isHandsUpInput: StateMachineInput | null = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'isHandsUp');

  // Divide the input width by the max value the state machine looks for in numLook.
  // This gets us a multiplier we can apply for each character typed in the input
  // to help Teddy track progress along the input line
  // useEffect(() => {
  //   if (inputRef?.current && !inputLookMultiplier) {
  //     setInputLookMultiplier((inputRef.current as HTMLInputElement).offsetWidth / 100);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [inputRef]);

  // console.log(inputRef.current && (inputRef.current as HTMLInputElement).offsetWidth);

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setUserValue(newVal);
    if (!isCheckingInput!.value) {
      isCheckingInput!.value = true;
    }
    const numChars = newVal.length;
    numLookInput!.value = numChars * 1.1;
  };

  // Start Teddy looking in the correct spot along the username input
  const onUsernameFocus = () => {
    isCheckingInput!.value = true;
    isHandsUpInput!.value = false;
    if (numLookInput!.value !== userValue.length * 1.1) {
      numLookInput!.value = userValue.length * 1.1;
    }
  };
  const onUserNameBlur = () => {
    isCheckingInput!.value = false;
  };
  const onSuccessSubmit = () => {
    trigSuccessInput!.fire();
  };
  const onFailSubmit = () => {
    trigFailInput!.fire();
  };
  const setIsHandUp = (value: boolean) => {
    isHandsUpInput!.value = value;
  };
  const authContext = useMemo(
    () => ({
      onUsernameFocus,
      onSuccessSubmit,
      onFailSubmit,
      setIsHandUp,
      onUsernameChange,
      usernameValue: userValue,
      onUserNameBlur
    }),
    [onUsernameFocus, onSuccessSubmit, onFailSubmit, setIsHandUp, onUsernameChange, userValue, onUserNameBlur]
  );
  // useEffect(() => {
  //   isHandsUpInput!.value = false;
  // }, [location.pathname]);

  const redirectToGithub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_APP_GITHUB_OAUTH_CLIENT_ID}&scope=user:email&redirect_uri=http://localhost:5173/login`;
    window.location.href = githubAuthUrl;
  };

  const LoginWithGithub = () => {
    redirectToGithub();
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search)?.get('code');
    if (code) {
      const fetchData = async () => {
        try {
          const data: any = await registerWithGithub(code);
          if (data?.success) {
            console.log('OAuth Success:');
            console.log(data?.user);
          } else onFailSubmit();
        } catch (error) {
          console.error('Error during GitHub OAuth:', error);
        }
      };

      fetchData();
    }
  }, [location.search, navigate]);
  return (
    <div className="rive-story-container-login">
      <div
        onClick={() => navigate(paths.home)}
        className="absolute left-10 top-10 flex cursor-pointer items-center gap-2"
      >
        <img src={logo} className="h-[32px] w-[32px]" style={{ userSelect: 'none' }} alt="Logo" />
        <h6 className="font-mono text-[2.2rem] font-extrabold" style={{ userSelect: 'none' }}>
          ITenv
        </h6>
      </div>
      <div className="login-form-component-root">
        <div className="login-form-wrapper">
          <div className="rive-wrapper">
            <RiveComponent className="rive-container" />
          </div>
          <AnimatePresence mode="wait">
            <div className="form-container card shadow-xl">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.25 }}
              >
                <Outlet context={authContext} />
              </motion.div>

              <div className="flex flex-col gap-5">
                <Typography.Text className="text-center opacity-55">or you can sign in with</Typography.Text>
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-8">
                    <div className="cursor-pointer rounded-full bg-black p-2 opacity-55 duration-200 hover:bg-[#ea4335] hover:opacity-100">
                      <FaGoogle size={18} className="text-white" />
                    </div>
                    <div className="flex cursor-pointer items-center justify-center rounded-full bg-black p-2 opacity-55 duration-200 hover:bg-[#0866ff] hover:opacity-100">
                      <FaFacebookF size={18} className="text-white" />
                    </div>
                    <FaGithub
                      onClick={LoginWithGithub}
                      size={27}
                      className="cursor-pointer opacity-55 duration-200 hover:opacity-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
