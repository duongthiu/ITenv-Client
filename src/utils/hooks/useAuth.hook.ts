import { useAppDispatch } from '../../redux/app/hook';
import { logout, setLogin, setToken, setUser } from '../../redux/user/user.slice';
import { LoginInforResponseType } from '../../services/authentication.service';
import { ResponsePagination } from '../../types/common';
import { UserType } from '../../types/UserType';

export function useAuth() {
  const dispatch = useAppDispatch();

  const onLogin = async <T>(
    fetcher: (params: T) => Promise<ResponsePagination<LoginInforResponseType> | null>,
    paramsLogin: T,
    onSuccessSubmit?: () => void,
    onFailSubmit?: (message: string) => void
  ) => {
    try {
      const resp = await fetcher(paramsLogin);
      if (resp) {
        if (resp.success) {
          dispatch(setToken(resp?.data?.token as string));
          dispatch(setLogin(true));
          dispatch(setUser(resp?.data?.userData as UserType));
          if (onSuccessSubmit) onSuccessSubmit();
        } else if (onFailSubmit) onFailSubmit(resp.message as string);
      } else {
        if (onFailSubmit) onFailSubmit('Login failed, please try again');
      }
    } catch (error) {
      if (onFailSubmit) onFailSubmit((error as Error).message || 'An error occurred');
    }
  };

  const onLogout = () => {
    dispatch(logout());
  };

  return {
    onLogin,
    onLogout
  };
}
