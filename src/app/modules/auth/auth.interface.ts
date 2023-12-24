export interface ILoginUser {
  id: string;
  password: string;
}

export interface IChangePassword {
  newPassword: string;
  oldPassword: string;
}
