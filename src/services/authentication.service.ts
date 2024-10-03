/* eslint-disable @typescript-eslint/no-explicit-any */
import { post } from '../apis/index';
import { ResponseAxios } from '../types/common';
import { UserType } from '../types/UserType';

export type RegisterType = {
  email: string;
  username: string;
  password: string;
  authenWith: number;
};
export type confirmSignupType = {
  email: string;
  username: string;
  password: string;
  authenWith: number;
  otp: string;
};
export const register = async (queryOption: RegisterType): Promise<any> => {
  try {
    const response = await post<any, RegisterType>(import.meta.env.VITE_APP_API + 'account/register', queryOption);
    return response as any;
  } catch (error) {
    console.error('Error running code:', error);
    throw error;
  }
};
export const confirmSignup = async (queryOption: confirmSignupType) => {
  try {
    const response = await post<any, RegisterType>(import.meta.env.VITE_APP_API + 'account/verify-signup', queryOption);
    return response as any;
  } catch (error) {
    console.error('Error running code:', error);
    throw error;
  }
};
export type LoginInforResponseType = {
  userData: UserType;
  token: string;
};
interface ParamsLogin {
  email: string;
  password: string;
}
export const login = async (params: ParamsLogin) => {
  const resp = await post<any, any>(import.meta.env.VITE_APP_API + 'account/login', {
    ...params,
    authenWith: 0
  });

  return resp as unknown as ResponseAxios<LoginInforResponseType>;
};
export const authenWithGithub = async (params: {
  code: string;
}): Promise<ResponseAxios<LoginInforResponseType> | null> => {
  try {
    const resp = await post<any, any>(import.meta.env.VITE_APP_API + 'account/github-oauth', params);
    return resp as unknown as ResponseAxios<LoginInforResponseType>;
  } catch (error) {
    return null;
  }
};
export const authenWithGoogle = async (params: { accessToken: string }) => {
  try {
    const resp = await post<any, any>(
      import.meta.env.VITE_APP_API + 'account/google-oauth', // Your backend API URL
      params
    );
    return resp as unknown as ResponseAxios<LoginInforResponseType>;
  } catch (error) {
    return null;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const resp = await post<any, any>(
      import.meta.env.VITE_APP_API + 'account/forgot-pass', // Your backend API URL
      { email }
    );
    return resp;
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (email: string) => {
  try {
    const resp = await post<any, any>(
      import.meta.env.VITE_APP_API + 'account/reset-pass', // Your backend API URL
      { email }
    );
    return resp;
  } catch (error) {
    console.log(error);
  }
};
