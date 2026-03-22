export interface IPreRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IRegister {
  email: string;
  otp: string;
}
