import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGODB_URI); // Add this line for debugging
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

export default connectDB;
