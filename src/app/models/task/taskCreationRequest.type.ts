export type TaskCreationRequest = {
  project_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'OPEN' | 'ONGOING' | 'DONE' | 'PAUSED' | 'CANCELLED';
  user_id: number;
};
