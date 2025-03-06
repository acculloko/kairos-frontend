export type LoginResponse = {
  id: number;
  name: string;
  email: string;
  creation_date: string;
  role: 'ADMIN' | 'USER';
  token: string;
};
