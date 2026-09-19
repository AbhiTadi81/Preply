import { Request, Response } from 'express';
import { usersStore, IUser } from '../models/User';

export const authController = {
  register(req: Request, res: Response) {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const newUser: IUser = {
      _id: 'usr_' + Date.now(),
      name,
      email,
      passwordHash: '$2a$10$hashedPasswordSimulated',
      targetRole: targetRole || 'Frontend Developer',
      createdAt: new Date().toISOString(),
    };

    usersStore.push(newUser);

    const token = 'jwt_token_' + newUser._id;
    return res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        targetRole: newUser.targetRole,
        createdAt: newUser.createdAt,
      },
      token,
    });
  },

  login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailTrimmed = email.trim();
    let user = usersStore.find((u) => u.email.toLowerCase() === emailTrimmed.toLowerCase());

    if (!user) {
      const derivedName = emailTrimmed.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      user = {
        _id: 'usr_' + Date.now(),
        name: derivedName || 'Candidate',
        email: emailTrimmed,
        passwordHash: '$2a$10$hashedPlaceholder',
        targetRole: 'Software Engineer',
        createdAt: new Date().toISOString(),
      };
      usersStore.push(user);
    } else if (user.name === 'Candidate Demo' || !user.name) {
      user.name = user.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    }

    const token = 'jwt_token_' + user._id;

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        createdAt: user.createdAt,
      },
      token,
    });
  },

  getCurrentUser(req: Request, res: Response) {
    const user = usersStore[0];
    return res.json({ user });
  },
};
