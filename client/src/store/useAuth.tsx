import create from "zustand";
import { LoginResponse, OneUser } from "../interfaces/login.interface";

interface AuthState {
  isLoggedIn: boolean;
  user: User;
  hasGoogleLogged: boolean;
  setLoggedIn: (b: boolean) => void;
  setUser: (u: User) => void;
  removeUser: () => void;
  setHasGoogleLogged: (c: boolean) => void;
  updateUserFriendList: (friend: OneUser) => void;
  updateFriendStatus: (friendId: string, isOnline: boolean) => void;
}

export type User = LoginResponse | null;

const useAuth = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  hasGoogleLogged: false,
  setLoggedIn: (b) => set({ isLoggedIn: b }),
  setUser: (u) => set({ user: u, isLoggedIn: true }),
  setHasGoogleLogged: (c) => set({ hasGoogleLogged: c }),
  updateUserFriendList: (newFriend) =>
    set((state) => ({
      user: { ...state.user!, friends: [...state.user!.friends, newFriend] },
    })),
  removeUser: () =>
    set({
      isLoggedIn: false,
      hasGoogleLogged: false,
      user: null,
    }),
  updateFriendStatus: (friendId, isOnline) =>
    set((state) => ({
      user: {
        ...state.user!,
        friends: state.user!.friends.map((friend) => {
          if (friend._id === friendId) {
            return {
              ...friend,
              isOnline,
            };
          } else {
            return friend;
          }
        }),
      },
    })),
}));

export default useAuth;
