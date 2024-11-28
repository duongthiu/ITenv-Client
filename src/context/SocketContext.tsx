import { DefaultEventsMap } from '@socket.io/component-emitter';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import audio from '../assets/sound/iphone_notice.mp3';
import { addFriendRequest, removeFriendRequest } from '../redux/friend/friend.slice';
import { useAppDispatch, useAppSelector } from '../redux/app/hook';
import {
  addMessageToMessageList,
  recallMessageAction,
  setConversationLastMessage,
  setSeenConversation
} from '../redux/message/message.slice';
import { getUser } from '../redux/user/user.slice';
import { ResponsePagination } from '../types/common';
import { MessageType } from '../types/ConversationType';
import { FriendType } from '../types/FriendType';
import { notifyInfo } from '../utils/helpers/notify';

const SocketContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
export const useSocket = () => useContext(SocketContext);
type SocketContextProviderProps = {
  children: React.ReactNode;
};
export const SocketProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const { token, isLogged, user } = useAppSelector((state) => state.user);
  const { activeConversationId } = useAppSelector((state) => state.conversation);
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
      socket.current.on('message', (message: ResponsePagination<MessageType>) => {
        const sound = new Audio(audio);
        sound.play();
        dispatch(setConversationLastMessage(message.data!));
        dispatch(addMessageToMessageList(message.data!));
        if (activeConversationId === message?.data?.conversationId && user?._id) {
          console.log(activeConversationId, message?.data?.conversationId);
          dispatch(setSeenConversation({ conversationId: message?.data?.conversationId, userId: user!._id! }));
          if (socket.current) socket.current.emit('seen_message', message.data);
        }
      });
      socket.current.on('accept_friend', (friend: FriendType) => {
        dispatch(removeFriendRequest(friend._id));
        notifyInfo(`${friend.receiver.username} accepted your friend request`);
      });
      socket.current.on('receive_friend', (friend: FriendType) => {
        console.log('receive_friend', friend);
        dispatch(addFriendRequest(friend));
        notifyInfo(`${friend.sendBy.username} sent you a friend request`);
      });

      socket.current.on('recall_message', (messageInfo: MessageType) => {
        console.log('recall_message', messageInfo);
        dispatch(recallMessageAction(messageInfo));
      });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isLogged, user?._id]);

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
