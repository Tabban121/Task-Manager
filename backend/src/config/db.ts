import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB  is connected :)');
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
};
