import express from 'express';
import { userValidator } from '../validators/userValidator.js';
import { userController } from '../controllers/userController.js';
import { userAndAdminAuthenticationCheck, AdminAuthenticationCheck } from '../config/authenticate.js';
// import { usernAuthCheck } from '../config/authenticate';

export const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Research-Paper
 *   description: Research-Paper
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /user/:
 *   post:
 *     tags:
 *       - USER
 *     summary: Register a User.
 *     description: Register a User.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. Invalid passkey.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 *     security:
 *       - X-Passkey: []
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name.
 *         lastName:
 *           type: string
 *           description: User's last name.
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *         password:
 *           type: string
 *           description: User's password.
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - Admin
 *           description: User's role.
 *   securitySchemes:
 *     X-Passkey:
 *       type: apiKey
 *       in: header
 *       name: X-Passkey
 */
userRouter.post('/', userValidator('register'), userController.registerUser);

/**
 * @swagger
 * /user/verify-email:
 *   post:
 *     tags:
 *      - USER
 *     summary: Verify user's email address
 *     description: Verify user's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User email verified successfully.
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 */
userRouter.post(
    '/verify-email',
    userValidator('verifyEmail'),
    userController.verifyEmail
);


/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *      - USER
 *     summary: Login user.
 *     description: Login user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: vivek.cilans@gmail.com
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 */

userRouter.post('/login', userValidator('loginUser'), userController.loginUser);



/**
 * @swagger
 * /user/me:
 *   get:
 *     tags:
 *      - USER
 *     summary: User information retrieval endpoint.
 *     description: User information retrieval endpoint.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
userRouter.get('/me', userAndAdminAuthenticationCheck, userController.me);


/**
     * @swagger
     * /user:
     *   put:
     *     tags:
     *      - USER
     *     summary: Update user's detail.
     *     description: Update user's detail.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *                 description: name of the user.

    *     responses:
    *       200:
    *         description: Password updated successfully.
    *       400:
    *         description: Bad request. Invalid input or missing required fields.
    *       500:
    *         description: Internal server error. Something went wrong on the server side.
    */

userRouter.put(
    '/',
    userValidator('updateUser'),
    userAndAdminAuthenticationCheck,
    userController.updateUser
);

/**
 * @swagger
 * /user/:
 *   get:
 *     tags:
 *      - USER
 *     summary: User information retrieval endpoint.
 *     description: User information retrieval endpoint.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isApproved
 *         schema:
 *           type: boolean
 *         description: Filter by approval status. 
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Filter by approval user name.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limit the number of results per page.
 *       - in: query
 *         name: pageNo
 *         schema:
 *           type: integer
 *         required: false
 *         description: pageNo the results by a specific number of records for pagination.
 *     responses:
 *       200:
 *         description: Successful operation. Returns company information.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */
userRouter.get('/', AdminAuthenticationCheck, userValidator('pagination'), userController.getUserList);



/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *      - USER
 *     summary: Get user by ID.
 *     description: Retrieve user information by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'  # Reference to the User schema definition.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */



userRouter.get('/:id', AdminAuthenticationCheck, userController.getUser);



/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags:
 *      - USER
 *     summary: Update user by ID.
 *     description: Update user's details by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: New first name of the user.
 *               lastName:
 *                 type: string
 *                 description: New last name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: New email address of the user.
 *               isApproved:
 *                 type: boolean
 *                 description: New approval status of the user.
 *               isVerified:
 *                 type: boolean
 *                 description: New verification status of the user.
 *               role:
 *                 type: string
 *                 enum: [Admin, User]
 *                 description: New role of the user. Must be either 'admin' or 'user'.
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */

userRouter.put('/:id', AdminAuthenticationCheck, userValidator('updateByAdmin'), userController.updateByAdmin);
