import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sessionModel from '../models/session.model'; 

dotenv.config();

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.trim() === '') {
      res.status(401).json({ message: 'Token malformed or empty' });
      return;
    }

    console.log('Token to verify:', token); // Debug log to check token value

    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const session = await sessionModel.findOne({ token });
    if (!session) {
      res.status(401).json({ message: 'Invalid session' });
      return;
    }

    res.locals.user = session.userId; //session.userId
    res.locals.token = session.token;
    next(); // Proceed to next middleware or route handler
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
