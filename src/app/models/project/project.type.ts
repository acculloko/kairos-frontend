import { User } from '../user/user.type';

export type Project = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  creation_date: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  responsible_user: User;
};
