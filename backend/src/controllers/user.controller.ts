/**
 * File: src/controllers/user.controller.ts
 * Description: This file defines routes and handlers related to user management.
 * It includes an endpoint for retrieving user information.
 * Author: Sadık Mahmut
 * Date: 03.10.2023
 * Version: 1.0
 */


import express, { Request, Response } from 'express';
import pool from '../helpers/db';
import { authenticateToken } from '../middleware/auth';


// Extends Request for type checking authenticated requests.
interface AuthenticatedRequest extends Request {
    user?: { userId: any } | undefined;
}


// Create an Express Router
const router = express.Router();


/**
 * Retrieves user information for the authenticated user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/getUser', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;

        const query = 'SELECT "Id", "Username", "Email", "FirstName", "LastName", "Phone", "Address", "Role" FROM "Users" WHERE "Id" = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export { router };
