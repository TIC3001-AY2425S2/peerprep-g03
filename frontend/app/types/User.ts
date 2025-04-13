// Base User
export interface BaseUser {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

// Collab Peer User
export type PeerUser = {
  id: string;
  name: string;
  color?: string;
  cursorColor?: string;
  userColor?: string;
};

export type UserProfile = Pick<BaseUser, "username" | "email" | "createdAt">;

export type UpdateUserPayload = Partial<
  Pick<BaseUser, "username" | "email">
> & {
  password?: string;
};
export type UpdateUserResponse = BaseUser;

export type LoginPayload = {
  email: string;
  password: string;
};
export interface LoginResponse extends BaseUser {
  accessToken: string;
}

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};
export type RegisterResponse = BaseUser;

export type GetUserByIdResponse = BaseUser;
