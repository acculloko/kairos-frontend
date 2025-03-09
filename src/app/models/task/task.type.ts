import { Project } from '../project/project.type';
import { User } from '../user/user.type';

export type Task = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'OPEN' | 'ONGOING' | 'DONE' | 'PAUSED' | 'CANCELLED';
  creation_date: string;
  responsible_user: User;
  project: Project;
};
