import { body, query } from 'express-validator';
import { userRoles } from '../utils/helper.js';

export const userValidator = function (method) {
    switch (method) {
        case 'register': {
            return [
                body('firstName', 'Invalid first name!').notEmpty(),
                body('lastName', 'Invalid last name!').notEmpty(),
                body('email', 'Invalid email!').notEmpty().isEmail(),
                body('password', 'Invalid password!').notEmpty(),
                body('role', 'Invalid role!').notEmpty().isIn(Object.values(userRoles)),
            ];
        }
        case 'verifyEmail': {
            return [
                body('email', 'Invalid email!').notEmpty().isEmail(),
                body('otp', 'Otp is missing!').notEmpty().isNumeric(),
            ];
        }
        case 'loginUser': {
            return [
                body('email', 'Invalid email!').notEmpty().isEmail(),
                body('password', 'Invalid password!').notEmpty(),
            ];
        }
        case 'updateUser': {
            return [
                body('firstName', 'Invalid first name!').optional().isString(),
                body('lastName', 'Invalid last name!').optional().isString(),
                body('email').not().exists().withMessage("Email cannot be updated."),
                body('isApproved').not().exists().withMessage("isApproved cannot be updated."),
                body('isVerified').not().exists().withMessage("isVerified cannot be updated."),
                body('password').not().exists().withMessage("Password cannot be updated."),
                body('otp').not().exists().withMessage("OTP cannot be updated."),
                body('role').not().exists().withMessage("Role cannot be updated.")
            ];
        }
        case 'updateByAdmin': {
            return [
                body('firstName', 'Invalid first name!').optional().isString(),
                body('lastName', 'Invalid last name!').optional().isString(),
                body('email').optional().isEmail().withMessage('Invalid email format!'),
                body('isApproved').optional().isBoolean().withMessage('isApproved must be a boolean value!'),
                body('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean value!'),
                body('password').not().exists().withMessage("Password cannot be updated."),
                body('otp').not().exists().withMessage("OTP cannot be updated."),
                body('role').optional().isIn(Object.values(userRoles)).withMessage('Invalid role! Must be either "Admin" or "User".')
            ];
        }

        case 'pagination': {
            return [
                query('isApproved')
                    .optional()
                    .default(true)
                    .isBoolean()
                    .withMessage('isApproved must be a boolean value'),
                query('query')
                    .optional()
                    .isString()
                    .withMessage('Name or email must be a string'),
                query('limit')
                    .optional()
                    .isInt({ min: 1 })
                    .withMessage('Limit must be a positive integer'),
                query('pageNo')
                    .optional()
                    .isInt({ min: 1 })
                    .withMessage('PageNo must be a positive integer'),
            ];
        }
    }
}; 
