import sessionModel from '../models/session.model';
import { ISession } from '../interfaces/ISession';

// Create a new session
export const createSession = async (sessionData: ISession) => {
  try {
    return await sessionModel.create(sessionData);
  } catch (err) {
    throw new Error('Error creating session: ' + err);
  }
};

// Find session by token
export const findSessionByToken = async (token: string) => {
  try {
    return await sessionModel.findOne({ token });
  } catch (err) {
    throw new Error('Error finding session: ' + err);
  }
};

// Delete session by ID
export const deleteSessionById = async (sessionId: string) => {
  try {
    return await sessionModel.findByIdAndDelete(sessionId);
  } catch (err) {
    throw new Error('Error deleting session: ' + err);
  }
};

