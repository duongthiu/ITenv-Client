import { createSlice } from '@reduxjs/toolkit';
import { ConversationType, MessageType } from '../../types/ConversationType';

type InitialState = {
  conversations: ConversationType[] | undefined;
  activeConversationId: '';
  currentMessageList: MessageType[];
  isOpenConversationInfo: boolean;
};
const initialState: InitialState = {
  conversations: undefined,
  activeConversationId: '',
  currentMessageList: [] as MessageType[],
  isOpenConversationInfo: false
};

export const messageSlice = createSlice({
  initialState: initialState,
  name: 'message',
  reducers: {
    setAtiveConversationId: (state, action) => {
      state.activeConversationId = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action: { payload: ConversationType }) => {
      state.conversations?.unshift(action.payload);
    },
    updateConversationAction: (state, action: { payload: ConversationType }) => {
      state.conversations = state.conversations?.filter((conv) => conv._id !== action.payload._id);

      state.conversations?.unshift({ ...action.payload });

      if (state.activeConversationId === action.payload._id && action.payload.lastMessage) {
        state.currentMessageList.push(action.payload.lastMessage);
      }
    },
    removeConversation: (state, action: { payload: string }) => {
      state.conversations = state.conversations?.filter((conversation) => conversation._id !== action.payload);
    },
    setCurrentMessageList: (state, action) => {
      state.currentMessageList = action.payload;
    },
    appendMessagesToList: (state, action) => {
      // Append new messages at the start of the current list (older messages first)
      state.currentMessageList = [...action.payload, ...state.currentMessageList];
    },
    toggleConversationInfo: (state) => {
      state.isOpenConversationInfo = !state.isOpenConversationInfo;
    },
    addMessageToMessageList: (state, action: { payload: MessageType }) => {
      if (state.activeConversationId === action.payload.conversationId) {
        state.currentMessageList.push(action.payload);
      }
      const conversation = state?.conversations?.find(
        (conv: ConversationType) => conv._id === action.payload.conversationId
      );
      console.log(conversation);
      if (conversation) {
        conversation.lastMessage = action.payload;
        //sort
        state?.conversations?.sort((a: ConversationType, b: ConversationType) => {
          const dateA = a.lastMessage?.createdAt || 0;
          const dateB = b.lastMessage?.createdAt || 0;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
      } else {
        if (action.payload.conversation) {
          // console.log(action.payload.conversation);
          const newConversation = { ...action.payload.conversation, lastMessage: action.payload };

          state?.conversations ? state?.conversations.unshift(newConversation) : [newConversation];
        }
      }
    },

    setConversationLastMessage: (state, action: { payload: MessageType }) => {
      const conversation = state?.conversations?.find((conv) => conv._id === action.payload.conversationId);
      if (conversation) {
        conversation.lastMessage = action.payload;

        state?.conversations?.sort((a: ConversationType, b: ConversationType) => {
          const dateA = a.lastMessage?.createdAt || 0;
          const dateB = b.lastMessage?.createdAt || 0;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
      }
    },
    setSeenConversation: (state, action: { payload: { conversationId: string; userId: string } }) => {
      const conversation = state?.conversations?.find((conv) => conv._id === action.payload.conversationId);
      if (conversation) {
        conversation.lastMessage?.isSeenBy?.push(action.payload.userId);
      }
    },
    recallMessageAction: (state, action: { payload: MessageType }) => {
      const message = state.currentMessageList.find((msg) => msg._id === action.payload._id);
      if (message) {
        message.isRecalled = true;
        const conversation = state?.conversations?.find((conv) => conv._id === action.payload.conversationId);
        if (conversation && conversation.lastMessage?._id === action.payload._id) {
          conversation!.lastMessage!.isRecalled = true;
        }
      }
    }
  }
});
export const {
  setAtiveConversationId,
  setConversations,
  setCurrentMessageList,
  setConversationLastMessage,
  setSeenConversation,
  appendMessagesToList,
  addMessageToMessageList,
  recallMessageAction,
  updateConversationAction,
  addConversation,
  removeConversation,
  toggleConversationInfo
} = messageSlice.actions;
const reducer = messageSlice.reducer;
export default reducer;
