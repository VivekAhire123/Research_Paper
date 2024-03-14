import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { emailOTP } from '../utils/mailutils.js'
import { otpGenerate, userRoles } from '../utils/helper.js';
import bcrypt from 'bcrypt';
import { getUserToken } from '../config/authenticate.js';

export const userController = {

    registerUser: [
        async (req, res) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res
                        .status(400)
                        .json({ status: false, message: errors.errors[0].msg });
                }


                const hashPassword = await bcrypt.hash(`${req.body.password}`, 10);
                req.body.password = hashPassword;
                const otp = await otpGenerate();
                const { firstName, lastName, email, role, password } = req.body;

                const checkUser = await User.findOne({ email });

                if (checkUser) {
                    return res.status(400).json({ status: false, message: 'User already exist.' });
                }

                if (role === userRoles.Admin) {
                    const passkey = req.headers['x-passkey'];
                    if (!passkey || passkey !== process.env.PASSKEY) {
                        return res.status(400).json({ status: false, message: 'Failed to create superAdmin.' });
                    }
                }

                const newUser = new User({ firstName, lastName, email, role, password, otp });
                const otpSent = await emailOTP(email, otp);
                if (!otpSent) {
                    return res.status(400).json({ status: false, message: 'Failed to send OTP' });
                }

                const user = await newUser.save();
                if (!user) {
                    return res.status(400).json({ status: false, message: 'Failed to register user' });
                }

                return res.status(200).json({
                    status: true,
                    message: 'User registered successfully, Please check your email for OTP.'
                });

            } catch (err) {
                return res.status(400).json({
                    status: false,
                    message: err?.message,
                });
            }
        }

    ],
    verifyEmail: [
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ status: false, message: errors.errors[0].msg });
                }

                const { email, otp } = req.body;

                const user = await User.findOne({ email });

                if (!user) {
                    return res.status(400).json({ status: false, message: 'User does not exist.' });
                }

                if (user.isVerified) {
                    return res.status(400).json({ status: false, message: 'User is already verified.' });
                }

                if (user.otp !== otp) {
                    return res.status(400).json({ status: false, message: 'Invalid OTP.' });
                }

                await User.updateOne({ _id: user.id }, { $set: { otp: null, isVerified: true } });

                return res.status(200).json({ status: true, message: 'Email verified successfully.' });
            } catch (error) {
                return res.status(400).json({ status: false, message: error.message });
            }
        },
    ],

    /**
 * Enhanced controller method for user authentication and login.
 * Validates request, checks email existence, verifies password, generates token,
 * and for organization admin, checks account approval and updates OTP status if applicable.
 * Returns tailored success or error responses.
 */
    loginUser: [
        async (req, res) => {
            try {
                // Validate request body
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        status: false,
                        message: errors.errors[0].msg,
                    });
                }
                const user = await User.findOne({ email: req.body.email });
                if (!user) {
                    return res.status(400).json({
                        status: false,
                        message: 'Invalid Id & Password',
                    });
                }
                if (!user.isVerified) {
                    return res.status(400).json({
                        status: false,
                        message: 'Email address is not verified!!',
                    });
                }
                // Check if password is valid
                const validPassword = await bcrypt.compare(
                    req.body.password,
                    user.password
                );
                if (!validPassword) {
                    return res.status(400).json({
                        status: false,
                        message: 'Invalid Id & Password',
                    });
                }

                // Update OTP status if applicable
                const otpCheck = await User.findById(user.id);
                if (otpCheck.otp) {
                    await User.updateOne({ _id: user.id }, { $set: { otp: null, isVerified: true } });
                }
                // Generate token for user
                const token = await getUserToken(user);
                return res.status(200).json({
                    status: true,
                    message: 'login successful.',
                    data: { token },
                });
            } catch (err) {
                return res.status(400).json({
                    status: false,
                    message: err?.message,
                });
            }
        },
    ],

    /**
  * Controller method to get user details.
  * Retrieves details of the authenticated user.
  * Sends a response containing the user details or an error message if any.
  */
    me: [
        async (req, res) => {
            try {
                const { firstName, lastName, email, role, isApproved } = req.user;
                res.status(200).json({
                    status: true,
                    data: { firstName, lastName, email, role, isApproved },
                });
            } catch (err) {
                res.status(400).json({
                    status: false,
                    message: err?.message,
                });
            }
        },
    ],
    updateUser: [
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        status: false,
                        message: errors.errors[0].msg,
                    });
                }

                const userId = req.user.id;
                const userDetails = req.body;

                const updateUser = await User.findOneAndUpdate({ _id: userId }, userDetails, { new: true });

                if (updateUser) {
                    return res.status(200).json({
                        status: true,
                        message: 'User updated successfully!',
                        updatedUser: updateUser, // Optionally, send updated user details in the response
                    });
                } else {
                    return res.status(404).json({
                        status: false,
                        message: 'User not found', // Handle case when user is not found
                    });
                }
            } catch (err) {
                return res.status(500).json({
                    status: false,
                    message: err.message || 'Internal Server Error',
                });
            }
        },
    ],

    getUserList: [
        async (req, res) => {
            try {

                const isActive = req?.query?.isActive === 'true' || req.query.isActive === '1';
                const pageNo = parseInt(req.query.pageNo, 10) || 1;
                const limit = parseInt(req.query.limit, 10) || 10;
                const queryfilter = req.query.query || '';

                const query = {};

                if (typeof isActive === 'boolean') {
                    query.isActive = isActive;
                }
                if (queryfilter) {
                    query.$or = [
                        { firstName: { $regex: new RegExp(queryfilter, 'i') } },
                        { lastName: { $regex: new RegExp(queryfilter, 'i') } },
                        { email: { $regex: new RegExp(queryfilter, 'i') } }
                    ];
                }

                const count = await User.countDocuments(query);
                const users = await User.find(query)
                    .select('-password -otp -updatedAt -createdAt') // Excluding sensitive fields
                    .skip((pageNo - 1) * limit)
                    .limit(limit);


                return res.status(200).json({
                    status: true,
                    data: {
                        list: users,
                        total: count,
                        next: count > (pageNo - 1) * limit + limit,
                    }
                });
            }
            catch (err) {
                res.status(400).json({
                    status: false,
                    message: err?.message,
                });
            }
        }
    ],
    getUser: [

        async (req, res) => {
            try {
                const userId = req.params.id; // Extract user ID from request parameters

                // Fetch user by ID
                const user = await User.findById(userId).select('-password -otp -updatedAt -createdAt');

                // Check if user exists
                if (!user) {
                    return res.status(404).json({ status: false, error: "User not found" });
                }

                // User found, return user data
                return res.status(200).json({
                    status: true,
                    user: user
                });
            } catch (err) {
                res.status(400).json({
                    status: false,
                    message: err?.message,
                });
            }
        }
    ],
    updateByAdmin: [
        async (req, res) => {
            try {
                const userId = req.params.id; // Extract user ID from request parameters
                const updates = req.body; // Extract updates from request body

                console.log('Request Body:', req.body);
                // Perform validation of the updates using express-validator
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ status: false, errors: errors.errors[0].msg });
                }

                // Find user by ID and update
                const user = await User.findByIdAndUpdate(userId, updates, { new: true });

                // Check if user exists
                if (!user) {
                    return res.status(404).json({ status: false, error: "User not found" });
                }

                // User updated successfully, return updated user data
                return res.status(200).json({
                    status: true,
                    message: "User updated successfully",
                    user: user
                });
            } catch (err) {
                res.status(400).json({
                    status: false,
                    message: err?.message,
                });
            }
        }
    ]



}