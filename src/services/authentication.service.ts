/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post } from '../apis/index';
import { AccountType } from '../types/AccountType';
import { ResponseAxios, ResponsePagination } from '../types/common';
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
    const response = await post<any, RegisterType>(import.meta.env.VITE_APP_API + 'accounts/register', queryOption);
    return response as any;
  } catch (error) {
    console.error('Error running code:', error);
    throw error;
  }
};
export const confirmSignup = async (queryOption: confirmSignupType) => {
  try {
    const response = await post<any, RegisterType>(
      import.meta.env.VITE_APP_API + 'accounts/verify-signup',
      queryOption
    );
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
export const login = async (params: ParamsLogin): Promise<ResponsePagination<LoginInforResponseType>> => {
  const resp = await post(import.meta.env.VITE_APP_API + 'accounts/login', {
    ...params,
    authenWith: 0
  });

  return resp as unknown as ResponsePagination<LoginInforResponseType>;
};
export const authenWithGithub = async (params: {
  code: string;
}): Promise<ResponsePagination<LoginInforResponseType>> => {
  const resp = await post<any, any>(import.meta.env.VITE_APP_API + 'accounts/github-oauth', params);
  return resp as unknown as ResponsePagination<LoginInforResponseType>;
};
export const authenWithGoogle = async (params: {
  accessToken: string;
}): Promise<ResponsePagination<LoginInforResponseType>> => {
  const resp = await post<any, any>(
    import.meta.env.VITE_APP_API + 'accounts/google-oauth', // Your backend API URL
    params
  );
  return resp as unknown as ResponsePagination<LoginInforResponseType>;
};

export const forgotPassword = async (email: string) => {
  try {
    const resp = await post<any, any>(
      import.meta.env.VITE_APP_API + 'accounts/forgot-pass', // Your backend API URL
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
      import.meta.env.VITE_APP_API + 'accounts/reset-pass', // Your backend API URL
      { email }
    );
    return resp;
  } catch (error) {
    console.log(error);
  }
};

export const getAllAccount = async (): Promise<ResponsePagination<AccountType>> => {
  const result = await get(import.meta.env.VITE_APP_API + 'accounts');
  return result as unknown as ResponsePagination<AccountType>;
};

export const refreshAccessToken = async (): Promise<ResponsePagination<string>> => {
  const result = await post(import.meta.env.VITE_APP_API + 'accounts/refresh-accessToken', {});
  return result as unknown as ResponsePagination<string>;
};
