import express from "express";
import { researchPaperValidator } from "../validators/researchPaperValidator.js";
import { AdminAuthenticationCheck } from "../config/authenticate.js";
import { researchPaperController } from "../controllers/researchPaperController.js";
import multer from "multer";

export const adminRouter = express.Router();


const upload = multer();
/**
 * @swagger
 * /research-paper:
 *   post:
 *     tags:
 *      - Admin
 *     summary: Create a research paper.
 *     description: Create a new research paper entry.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: title
 *         type: string
 *         required: true
 *         description: Title of the research paper.
 *       - in: formData
 *         name: authorName
 *         type: string
 *         required: true
 *         description: Name of the author of the research paper.
 *       - in: formData
 *         name: type
 *         type: string
 *         description: Type of the research paper.
 *       - in: formData
 *         name: category
 *         type: string
 *         description: Category of the research paper.
 *       - in: formData
 *         name: description
 *         type: string
 *         description: Description of the research paper.
 *       - in: formData
 *         name: reference
 *         type: string
 *         description: Reference of the research paper.
 *       - in: formData
 *         name: upfile
 *         type: file
 *         description:  The file to upload.
 *     responses:
 *       201:
 *         description: Research paper created successfully.
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */

adminRouter.post('/', AdminAuthenticationCheck, upload.single("file"), researchPaperValidator('createResearchPaper'), researchPaperController.createResearchPaper);


/**
 * @swagger
 * /research-paper/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update a research paper.
 *     description: Update an existing research paper entry.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the research paper to update.
 *       - in: formData
 *         name: title
 *         type: string
 *         description: Title of the research paper.
 *       - in: formData
 *         name: authorName
 *         type: string
 *         description: Name of the author of the research paper.
 *       - in: formData
 *         name: type
 *         type: string
 *         description: Type of the research paper.
 *       - in: formData
 *         name: category
 *         type: string
 *         description: Category of the research paper.
 *       - in: formData
 *         name: description
 *         type: string
 *         description: Description of the research paper.
 *       - in: formData
 *         name: reference
 *         type: string
 *         description: Reference of the research paper.
 *       - in: formData
 *         name: upfile
 *         type: file
 *         description: The file to upload.
 *     responses:
 *       200:
 *         description: Research paper updated successfully.
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       404:
 *         description: Research paper not found.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */
adminRouter.put('/:id', AdminAuthenticationCheck, upload.single("file"), researchPaperValidator('updateResearchPaper'), researchPaperController.updateResearchPaper);