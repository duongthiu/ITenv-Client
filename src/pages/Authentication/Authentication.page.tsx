/* eslint-disable react-hooks/exhaustive-deps */
import { useGoogleLogin } from '@react-oauth/google';
import { Typography } from 'antd';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Alignment, Fit, Layout, RiveState, StateMachineInput, useRive, useStateMachineInput } from 'rive-react';
import logo from '../../assets/logo/logo.png';
import { useAppSelector } from '../../redux/app/hook';
import { paths } from '../../routes/paths';
import { authenWithGithub, authenWithGoogle } from '../../services/authentication.service';
import { notifyError, notifySuccess } from '../../utils/helpers/notify';
import { useAuth } from '../../utils/hooks/useAuth.hook';
import LoadingPage from '../commons/LoadingPage';
import './Authentication.style.scss';
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
  const { onLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { isLogged } = useAppSelector((state) => state.user);
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
    if (trigSuccessInput) trigSuccessInput!.fire();
  };
  const onFailSubmit = () => {
    if (trigFailInput) trigFailInput!.fire();
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
  const LoginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);

        await onLogin(
          () => authenWithGoogle({ accessToken: tokenResponse.access_token }),
          {
            accessToken: tokenResponse.access_token
          },
          () => {
            onSuccessSubmit();
            notifySuccess('Login successful');
            navigate(paths.home);
          },
          (message: string) => {
            onFailSubmit();
            notifyError(message || 'Login failed, please try again');
          }
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        notifyError((error as Error).message || 'Login failed, please try again');
        onFailSubmit();
      }
    },
    onError: () => onFailSubmit()
  });

  // const responseFacebook = (response: ReactFacebookLoginInfo) => {
  //   console.log(response);
  // };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search)?.get('code');
    if (code) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          await onLogin(
            authenWithGithub,
            {
              code: code
            },
            () => {
              onSuccessSubmit();
              notifySuccess('Login successful');
              navigate(paths.home);
            },
            (message: string) => {
              onFailSubmit();
              notifyError(message || 'Login failed, please try again');
            }
          );
          setIsLoading(true);
        } catch (error) {
          setIsLoading(true);

          notifyError('Error during GitHub OAuth: ' + (error as Error).message);
        }
      };

      fetchData();
    }
  }, [location.search, navigate]);
  useEffect(() => {
    if (isLogged) navigate(`${paths.home}`);
  }, []);
  return (
    <div className="rive-story-container-login">
      {isLoading && <LoadingPage />}
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

          <div className="form-container card shadow-xl">
            <Outlet context={authContext} />

            <div className="flex flex-col gap-5">
              <Typography.Text className="text-center opacity-55">or you can sign in with</Typography.Text>
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-8">
                  <div className="cursor-pointer rounded-full bg-black p-2 opacity-55 duration-200 hover:bg-[#ea4335] hover:opacity-100">
                    <FaGoogle onClick={() => LoginWithGoogle()} size={18} className="text-white" />
                  </div>
                  {/* <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        console.log(credentialResponse);
                      }}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                    /> */}
                  {/* <div className="button-container flex cursor-pointer items-center justify-center rounded-full bg-black p-2 opacity-55 duration-200 hover:bg-[#0866ff] hover:opacity-100">
                       <FacebookLogin
                        appId="1054271949826165" // Replace with your actual Facebook App ID
                        autoLoad={true} // Optional, set to true if you want it to auto load
                        fields="name,email,picture" // Requesting fields including email
                        scope="public_profile,email" // Requesting the email and public profile permissions
                        callback={responseFacebook} // Handle Facebook login callback
                        buttonStyle={{
                          all: 'initial'
                        }}
                        textButton=""
                        icon={<FaFacebookF size={18} className="cursor-pointer text-white" />}
                      /> 
                    </div> */}
                  <FaGithub
                    onClick={LoginWithGithub}
                    size={27}
                    className="cursor-pointer opacity-55 duration-200 hover:opacity-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
