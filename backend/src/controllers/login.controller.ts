/**
 * File: src/controllers/login.controller.ts
 * Description: This file defines routes and handlers related to user login.
 * It includes an endpoint for user login, where the user provides a username and password.
 * Author: Sadık Mahmut
 * Date: 03.10.2023
 * Version: 1.0
 */


import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../helpers/db';
import { config } from '../../config/config';


// Create an Express Router
const router = express.Router();


/**
 * Handles user login by verifying the provided username and password.
 * If the username exists and the password is valid, it generates a JWT token for authentication.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - Returns a JSON object containing a JWT token upon successful login.
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = 'SELECT "Id", "PasswordHash" FROM "Users" WHERE "Username" = $1';
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user.Id }, config.secretKey, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export { router };
