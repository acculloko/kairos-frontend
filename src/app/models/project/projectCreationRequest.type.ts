export type ProjectCreationRequest = {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  user_id: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
};
