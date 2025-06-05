// src/models/session.model.ts
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // auto-expire after 7 days
});

export default mongoose.model('Session', sessionSchema);
 