import { Task } from '../task/task.type';
import { User } from '../user/user.type';

export type Timelog = {
  id: number;
  description: string;
  start_date: string;
  end_date: string;
  log_time: string;
  task: Task;
  user: User;
};
