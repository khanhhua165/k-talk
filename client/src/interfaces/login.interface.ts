export interface OneUser {
  _id: string;
  name: string;
  isOnline: boolean;
  picture?: string;
  email: string;
}

//* MainUser
export interface LoginResponse extends OneUser {
  friends: OneUser[];
}
