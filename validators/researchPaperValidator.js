import { body, param } from 'express-validator';

export const researchPaperValidator = function (method) {
    switch (method) {
        case 'createResearchPaper': {
            return [
                body('title', 'Title is required').notEmpty(),
                body('authorName', 'Author name is required').notEmpty(),
                body('type', 'Type is required').optional().notEmpty(),
                body('category', 'Category is required').optional().notEmpty(),
                body('description', 'Description is required').optional().notEmpty(),
                body('reference', 'Reference is required').optional().notEmpty(),
            ];
        }
        case 'updateResearchPaper': {
            return [
                param('id', 'Invalid research paper ID').isMongoId(),
                body('title', 'Title is required').optional().notEmpty(),
                body('authorName', 'Author name is required').optional().notEmpty(),
                body('type', 'Type is required').optional().notEmpty(),
                body('category', 'Category is required').optional().notEmpty(),
                body('description', 'Description is required').optional().notEmpty(),
                body('reference', 'Reference is required').optional().notEmpty(),
            ];
        }
    }
};

