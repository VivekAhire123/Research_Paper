import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const researchPaperSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: uuidv4 // Using UUID v4 as the default value for uuid
    },
    authorName: {
        type: String
    },
    type: {
        type: String
    },
    category: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    reference: {
        type: String,
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

export default mongoose.models.ResearchPaper || mongoose.model('ResearchPaper', researchPaperSchema);
