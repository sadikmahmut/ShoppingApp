/**
 * File: src/controllers/register.controller.ts
 * Description: This file defines routes and handlers related to user registration.
 * It includes an endpoint for registering a new user.
 * Author: Sadık Mahmut
 * Date: 03.10.2023
 * Version: 1.0
 */


import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import pool from '../helpers/db'


// Create an Express Router
const router = express.Router();


/**
 * Registers a new user by hashing their password and inserting their information into the database.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.post('/registerUser', async (req, res) => {
    const { firstName, lastName, username, email, phone, address, password } = req.body;
  
    try {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userId = uuidv4();

        const query =
        'INSERT INTO "Users" ("Id", "FirstName", "LastName", "Username", "Email", "Phone", "Address", "PasswordHash", "Active", "CreatedDate", "Role") ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), $9)';
        
        await pool.query(query, [userId, firstName, lastName, username, email, phone, address, hashedPassword, 'customer']);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export { router };