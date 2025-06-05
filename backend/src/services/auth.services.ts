import { SignupDto , LoginDto } from '../dtos/auth.dtos';
import * as userRepo from '../repositories/user.repositories';
import * as sessionRepo from '../repositories/session.repositories';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { IUser } from '../interfaces/IUser';
import { ISession } from '../interfaces/ISession';
dotenv.config();

// Helper: Generates JWT Token
const generateJwtToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
};

// Helper: Creates Session
const createSession = async (userId: string) => {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs

  const session = await sessionRepo.createSession({
    userId: userId,
    token: sessionToken,
    created_time: new Date(),
    expiresAt,
    logoutAt: null,
  });

  return session;
};

// Service: Handles User Signup
export const signupService = async (data: SignupDto) => {
  const existingUser = await userRepo.findUserByEmail(data.email);
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const newUser = await userRepo.createUser({ ...data, password: hashedPassword });

  // Generate JWT Token
  const jwtToken = generateJwtToken(newUser._id.toString());

  // Create Session
  const session = await createSession(newUser._id.toString());

  return {
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      created_time: newUser.createdAt,
    },
    token: jwtToken,
    sessionToken: session.token,
  };
};

// Service: Handles User Login
export const loginService = async (data: LoginDto) => {
  const user = await userRepo.findUserByEmail(data.email);
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error('Invalid Password');

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      created_time: user.createdAt,
    }
  };
};

// Service: Handles User Logout
export const logoutService = async (token: string) => {
  const session = await sessionRepo.findSessionByToken(token);
  if (!session) throw new Error('Session not found');

  await sessionRepo.deleteSessionById(session._id.toString());
};
