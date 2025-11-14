import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';

dotenv.config();

const checkAdminUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all admin users
        const adminUsers = await User.find({ userType: 'admin' });
        console.log('Admin users found:', adminUsers.length);
        
        adminUsers.forEach((user, index) => {
            console.log(`\nAdmin ${index + 1}:`);
            console.log('Email:', user.email);
            console.log('Name:', user.name);
            console.log('UserType:', user.userType);
            console.log('isVerified:', user.isVerified);
            console.log('Created:', user.createdAt);
        });

        // Also check if sami@gmail.com exists and what userType it has
        const samiUser = await User.findOne({ email: 'sami@gmail.com' });
        if (samiUser) {
            console.log('\n=== sami@gmail.com user details ===');
            console.log('Email:', samiUser.email);
            console.log('Name:', samiUser.name);
            console.log('UserType:', samiUser.userType);
            console.log('isVerified:', samiUser.isVerified);
            console.log('Created:', samiUser.createdAt);
        }

    } catch (error) {
        console.error('❌ Error checking admin users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
        process.exit(0);
    }
};

checkAdminUsers();
