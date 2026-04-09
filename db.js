import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/todo-db');
    console.log('Connected to Local MongoDB');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
};

export default connectDB;
