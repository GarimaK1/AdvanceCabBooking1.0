export interface ScheduleCab {
  // A format for the structure and fields in the schedule cab form
  id: string;
  name: string;
  phone: number;
  email: string;
  pickup_date: Date;
  pickup_time: string;
  passengers: number;
  pickup_location: string;
  drop_location: string;
  creator?: string;
}
