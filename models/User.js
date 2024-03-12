
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false // Default value set to false
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default value set to current timestamp
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Default value set to current timestamp
        required: true
    }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
