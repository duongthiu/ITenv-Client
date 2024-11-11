import { DefaultEventsMap } from '@socket.io/component-emitter';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../redux/app/hook';
import { getUser } from '../redux/user/user.slice';

const SocketContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
export const useSocket = () => useContext(SocketContext);
type SocketContextProviderProps = {
  children: React.ReactNode;
};
export const SocketProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const { token, isLogged, user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isLogged && token) {
      dispatch(getUser());
      socket.current = io(import.meta.env.VITE_APP_BACKEND_URL, {
        auth: {
          token: token
        }
      });
      socket.current.on('connect', () => {
        console.log('Connected');
      });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [token, isLogged, dispatch, user?._id]);

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
