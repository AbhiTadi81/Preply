// User Model
export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  targetRole: string;
  createdAt: string;
}

// In-memory data store representation
export const usersStore: IUser[] = [
  {
    _id: 'usr_default',
    name: 'Candidate',
    email: 'candidate@example.com',
    passwordHash: '$2a$10$demoHashPlaceholder',
    targetRole: 'Frontend Developer',
    createdAt: new Date().toISOString(),
  },
];
