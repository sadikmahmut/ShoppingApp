/**
 * File: src/middleware/auth.ts
 * Description: This file defines middleware for authenticating user requests using JWT tokens.
 * Author: Sadık Mahmut
 * Date: 03.10.2023
 * Version: 1.0
 */


import jwt from 'jsonwebtoken';
import { config } from '../../config/config';


/**
 * Middleware to authenticate user requests using JWT tokens.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
function authenticateToken(req, res, next) {

    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, config.secretKey, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

export { authenticateToken };