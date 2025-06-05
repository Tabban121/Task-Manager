
import Users from '../models/Users';
import { SignupDto } from '../dtos/auth.dtos';

export const findUserByEmail = (email: string) => Users.findOne({ email });

export const createUser = (data: SignupDto & { password: string }) => Users.create(data);

export const findUserById = (id: string) => Users.findById(id);