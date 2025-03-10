export type TimelogCreationRequest = {
  description: string;
  start_date: string;
  end_date: string;
  task_id: number;
  user_id: number;
};
