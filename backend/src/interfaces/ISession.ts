export interface ISession {
  userId: string;
  token: string;
  created_time: Date;
  expiresAt: Date;
  logoutAt: Date | null;
}
