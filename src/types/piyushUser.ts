export interface PiyushUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
}

export interface PiyushCreateUserInput {
  name: string;
  email: string;
  password: string;
}