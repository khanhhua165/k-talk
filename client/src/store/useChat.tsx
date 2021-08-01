import create from "zustand";
export interface Message {
  sender: string;
  message: string;
}

interface Messages {
  [friendId: string]: Message[];
}

interface ChatState {
  messages: Messages;
  currentChat: string | null;
  updateMessages: (message: string, sender: string, curChat: string) => void;
  setCurrentChat: (friendId: string) => void;
  resetChat: () => void;
}

const useChat = create<ChatState>((set) => ({
  messages: {},
  currentChat: null,
  updateMessages: (message, sender, curChat) =>
    set((state) => {
      let newMessages: Messages;
      if (state.messages?.[curChat]) {
        newMessages = {
          ...state.messages,
          [curChat]: [...state.messages[curChat], { message, sender }],
        };
      } else {
        newMessages = { ...state.messages, [curChat]: [{ message, sender }] };
      }
      return {
        messages: newMessages,
      };
    }),
  setCurrentChat: (friendId) =>
    set((state) => ({
      currentChat: friendId,
    })),
  resetChat: () =>
    set((state) => ({
      messages: {},
      currentChat: null,
    })),
}));

export default useChat;
