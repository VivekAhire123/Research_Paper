import { validationResult } from 'express-validator';
import ResearchPaper from "../models/ResearchPaper.js";
import { handleFileUpload } from '../utils/awsUtils.js';


export const researchPaperController = {
    createResearchPaper: [
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ status: false, message: errors.array()[0].msg });
                }

                const { authorName, type, category, title, description, reference, isApproved } = req.body;

                const newResearchPaper = new ResearchPaper({
                    authorName, type, category, title, description, reference, isApproved
                });

                const savedResearchPaper = await newResearchPaper.save();

                if (savedResearchPaper) {
                    const { uuid } = savedResearchPaper;
                    await handleFileUpload(req.file, uuid);
                }

                return res.status(200).json({
                    status: true,
                    message: 'Research paper created successfully',
                    data: savedResearchPaper
                });
            } catch (err) {
                return res.status(400).json({ status: false, message: err.message });
            }
        }
    ],
    updateResearchPaper: [
        async (req, res) => {
            try {
                const paperId = req.params.id;
                const updates = req.body;
                const paper = await ResearchPaper.findByIdAndUpdate(paperId, updates, { new: true });
                await handleFileUpload(req.file, paper.uuid);
                return res.status(200).json({
                    status: true,
                    message: "Paper updated successfully",
                    paper: paper
                });
            } catch (err) {
                return res.status(400).json({ status: false, message: err.message });
            }
        }
    ],
};
