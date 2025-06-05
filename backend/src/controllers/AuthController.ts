import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/Users';
import {createUser} from '../repositories/user.repositories';
import dotenv from 'dotenv';
import crypto from 'crypto'
import sessionModel from '../models/session.model';
import { NextFunction } from 'express';
dotenv.config();



export const signup = async (req: Request, res: Response) => {
  console.log('signup controller called');

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await createUser({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    // Generate a random session token using crypto
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs

    // Save session with the random session token
    await sessionModel.create({
      userId: newUser._id,
      token: sessionToken,  
      created_time: newUser.createdAt,
      expiresAt,            
      logoutAt: null,       
      
    });

    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('Generated Token:', token);

    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        created_time: newUser.createdAt,
      },
      token, 
    
    });

  } catch (err) {
    console.error('Error in signup:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// lOGIN LOGIC :)


export const login = async (req: Request, res: Response) => {
  console.log('Login controller called');

  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid Password :)' });

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    // ✅ Store token in sessionModel
    await sessionModel.create({ userId: existingUser._id, token });

    // ✅ Send token to frontend
    res.status(200).json({
      result: "User login successfully",
      token, // <- this is now included
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        created_time: existingUser.createdAt,
      }
    });

  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


   export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(400).json({ message: 'Authorization token missing' });

    const token = authHeader.split(' ')[1]; 

    // Find the session by token
    const session = await sessionModel.findOne({ token });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    await sessionModel.findByIdAndDelete(session._id);


    // Send response confirming logout
    res.status(200).json({ message: 'Logout successful :)' });

  } catch (err) {
    console.error('Error in logout:', err);
    next(err); 
  }
};
