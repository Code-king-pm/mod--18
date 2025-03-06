import mongoose from 'mongoose';
import User from './User'; // Correct the path to your User model

async function testUserCreation() {
    try {
        await mongoose.connect('<Your MongoDB Connection String>',);
        console.log('Connected to MongoDB successfully!');
        const user = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'securepassword123',
        });
        console.log('User created successfully:', user);
    } catch (err) {
        console.error('Error creating user:', err);
    } finally {
        await mongoose.disconnect();
    }
}

testUserCreation();
