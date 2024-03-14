
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

console.log('

MongoDB URI: ', process.env.MONGODB_URI);


const dbConnect = async () => {

    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.error('MongoDB connection URI not provided');
        return;
    }

    if (mongoose.connections[0].readyState) return;

    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
};

export default dbConnect;
