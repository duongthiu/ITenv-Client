import { useAppDispatch } from '../../redux/app/hook';
import { logout, setLogin, setToken, setUser } from '../../redux/user/user.slice';
import { LoginInforResponseType } from '../../services/authentication.service';
import { ResponseAxios } from '../../types/common';

export function useAuth() {
  const dispatch = useAppDispatch();

  const onLogin = async <T>(
    fetcher: (params: T) => Promise<ResponseAxios<LoginInforResponseType> | null>,
    paramsLogin: T,
    onSuccessSubmit?: () => void,
    onFailSubmit?: (message: string) => void
  ) => {
    try {
      const resp = await fetcher(paramsLogin);
      if (resp) {
        if (resp.success) {
          dispatch(setToken(resp.data.token));
          dispatch(setLogin(true));
          dispatch(setUser(resp.data.userData));
          if (onSuccessSubmit) onSuccessSubmit();
        } else if (onFailSubmit) onFailSubmit(resp.message);
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
