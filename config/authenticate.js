import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { userRoles } from '../utils/helper.js';
import User from '../models/User.js';

dotenv.config();

const userSecretKey = process.env.USER_SECRET_KEY;


/**
 * Generates a JWT token for a user.
 * @param {Object} user - The user object containing user data.
 * @returns {string} - The JWT token.
 */
export const getUserToken = async (user) => {
    try {

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };
        return jwt.sign(payload, userSecretKey, {
            expiresIn: 1800, // Set the expiration time for the token to 1800 seconds (30 minutes)
        });
    } catch (err) {
        return err?.message;
    }
};

export const verifyUserToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res
                .status(401)
                .json({ status: false, message: 'No token provided.' });
        }
        const authen = async () => {
            if (!req.isAuthenticated) {
                const token = req.headers.authorization;
                await jwt.verify(
                    token.split('Bearer ')[1],
                    userSecretKey,
                    async (err, decoded) => {
                        if (!err) {
                            const user = await User.findOne({ email: decoded.email });
                            if (user && user.role === userRoles.User) {
                                req.isAuthenticated = true;
                                req.user = user;
                            }
                        }
                    }
                );
            }
        };
        await authen();
        await next();
    } catch (err) {
        return res.status(400).json({
            status: false,
            message: err?.message,
        });
    }
};

export const verifyAdminToken = async (req, res, next) => {

    try {
        const token = req.headers.authorization;
        if (!token) {
            return res
                .status(401)
                .json({ status: false, message: 'No token provided.' });
        }
        const authen = async () => {
            if (!req.isAuthenticated) {
                const token = req.headers.authorization;
                await jwt.verify(
                    token.split('Bearer ')[1],
                    userSecretKey,
                    async (err, decoded) => {
                        if (!err) {
                            const user = await User.findOne({ email: decoded.email });
                            if (
                                user &&
                                user.role === userRoles.Admin
                            ) {

                                req.isAuthenticated = true;
                                req.user = user;
                            }
                        }
                    }
                );
            }
        };
        await authen();
        await next();
    } catch (err) {
        return res.status(400).json({
            status: false,
            message: err?.message,
        });
    }
};


/**
 * Middleware to handle invalid token cases.
 */
export const invalidtoken = async (req, res, next) => {
    try {
        if (!req.isAuthenticated) {
            return res.status(401).json({
                status: false,
                message: 'unauthorized',
            });
        }
        await next();
    } catch (err) {
        return res.status(400).json({
            status: false,
            message: err?.message,
        });
    }
};

export const usernAuthCheck = [verifyUserToken, invalidtoken];

export const userAndAdminAuthenticationCheck = [verifyUserToken, verifyAdminToken, invalidtoken];
export const AdminAuthenticationCheck = [verifyAdminToken, invalidtoken];