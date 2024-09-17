/* eslint-disable @typescript-eslint/no-explicit-any */
import { post } from '../apis/index';

type RegisterType = {
  email: string;
  username: string;
  password: string;
  authenWith: number;
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
export const registerWithGithub = async (code: string) => {
  try {
    const resp = await post<any, any>(
      import.meta.env.VITE_APP_API + 'account/github-oauth', // Your backend API URL
      { code }
    );
    console.log(resp);
  } catch (error) {
    console.log(error);
  }
};
