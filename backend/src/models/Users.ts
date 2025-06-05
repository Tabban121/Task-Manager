import mongoose from 'mongoose';
// user info model for mongo check :)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true }); // req time of registeration

export default mongoose.model('User', userSchema);
