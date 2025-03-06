import mongoose from 'mongoose';

async function db() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/googlebooks', { 
            
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

export default db();





//'mongodb://127.0.0.1:27017/googlebooks'