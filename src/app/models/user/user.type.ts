export type User = {
  id: number;
  name: string;
  email: string;
  creation_date: string;
  last_login: string;
  role: 'ADMIN' | 'USER';
};
