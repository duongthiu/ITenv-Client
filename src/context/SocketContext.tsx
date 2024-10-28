import { createContext, useContext, useEffect, useRef } from 'react';
import { useAppSelector } from '../redux/app/hook';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

const SocketContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
export const useSocket = () => useContext(SocketContext);
type SocketContextProviderProps = {
  children: React.ReactNode;
};
export const SocketProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const { token, isLogged } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isLogged && token) {
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
  }, [token, isLogged]);
  
  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
