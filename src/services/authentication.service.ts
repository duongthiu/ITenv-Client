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
type LoginInforResponseType = {
  userData: UserType;
  token: string;
};
export const login = async (email: string, password: string) => {
  try {
    const resp = await post<any, any>(import.meta.env.VITE_APP_API + 'account/login', {
      email,
      password,
      authenWith: 0
    });
    return resp as unknown as ResponseAxios<LoginInforResponseType>;
  } catch (error) {
    console.log(error);
  }
};
export const authenWithGithub = async (code: string) => {
  try {
    const resp = await post<any, any>(import.meta.env.VITE_APP_API + 'account/github-oauth', { code });
    return resp as unknown as ResponseAxios<LoginInforResponseType>;
  } catch (error) {
    console.log(error);
  }
};
export const authenWithGoogle = async (accessToken: string) => {
  try {
    const resp = await post<any, any>(
      import.meta.env.VITE_APP_API + 'account/google-oauth', // Your backend API URL
      { accessToken }
    );
    return resp as unknown as ResponseAxios<LoginInforResponseType>;
  } catch (error) {
    console.log(error);
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
