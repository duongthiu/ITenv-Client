import { createSlice } from '@reduxjs/toolkit';
import { ConversationType, MessageType } from '../../types/ConversationType';

type InitialState = {
  conversations: ConversationType[];
  activeConversationId: '';
  currentMessageList: MessageType[];
};
const initialState: InitialState = {
  conversations: [],
  activeConversationId: '',
  currentMessageList: [] as MessageType[]
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
    setCurrentMessageList: (state, action) => {
      state.currentMessageList = action.payload;
    },
    appendMessagesToList: (state, action) => {
      // Append new messages at the start of the current list (older messages first)
      state.currentMessageList = [...action.payload, ...state.currentMessageList];
    },
    addMessageToMessageList: (state, action: { payload: MessageType }) => {
      if (state.activeConversationId === action.payload.conversationId) {
        state.currentMessageList.push(action.payload);

        const conversation = state.conversations.find(
          (conv: ConversationType) => conv._id === action.payload.conversationId
        );

        if (conversation) {
          conversation.lastMessage = action.payload;

          //sort
          state.conversations.sort((a: ConversationType, b: ConversationType) => {
            const dateA = a.lastMessage?.createdAt || 0;
            const dateB = b.lastMessage?.createdAt || 0;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
        }
      }
    },
    setConversationLastMessage: (state, action: { payload: MessageType }) => {
      const conversation = state.conversations.find((conv) => conv._id === action.payload.conversationId);
      if (conversation) {
        conversation.lastMessage = action.payload;

        state.conversations.sort((a: ConversationType, b: ConversationType) => {
          const dateA = a.lastMessage?.createdAt || 0;
          const dateB = b.lastMessage?.createdAt || 0;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
      }
    },
    setSeenConversation: (state, action: { payload: { conversationId: string; userId: string } }) => {
      const conversation = state.conversations.find((conv) => conv._id === action.payload.conversationId);
      if (conversation) {
        conversation.lastMessage?.isSeenBy?.push(action.payload.userId);
      }
    },
    recallMessageAction: (state, action: { payload: MessageType }) => {
      const message = state.currentMessageList.find((msg) => msg._id === action.payload._id);
      if (message) {
        message.isRecalled = true;
        const conversation = state.conversations.find((conv) => conv._id === action.payload.conversationId);
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
  recallMessageAction
} = messageSlice.actions;
const reducer = messageSlice.reducer;
export default reducer;
