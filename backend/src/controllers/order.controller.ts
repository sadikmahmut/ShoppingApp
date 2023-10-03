/**
 * File: src/controllers/order.controller.ts
 * Description: This file defines routes and handlers related to orders.
 * It includes endpoints for retrieving orders.
 * Author: Sadık Mahmut
 * Date: 03.10.2023
 * Version: 1.0
 */


import express from 'express';
import pool from '../helpers/db'
import { authenticateToken } from '../middleware/auth';


// Create an Express Router
const router = express.Router();


/**
 * Retrieves all orders.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/getAllOrders', authenticateToken, (req, res) => {
    const query = `
    SELECT
        "Orders"."Id",
        "Users"."Username" AS "Username",
        "Products"."Name" AS "ProductName",
        "Orders"."ProductId",
        "Orders"."UserId",
        "Orders"."Date",
        "Orders"."Status"
    FROM "Orders"
    INNER JOIN "Users" ON "Orders"."UserId" = "Users"."Id"
    INNER JOIN "Products" ON "Orders"."ProductId" = "Products"."Id"
    `;
  
    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(result.rows);
        }
    });
});


/**
 * Retrieves orders by user ID.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/getOrdersByUserId/:userId', authenticateToken, (req, res) => {
    const userId = req.params.userId;
    
    const query = `
    SELECT
        "Orders"."Date",
        "Orders"."Status",
        "Products"."Name",
        "Products"."Description",
        "Products"."Price"
    FROM "Orders"
    INNER JOIN "Products" ON "Orders"."ProductId" = "Products"."Id"
    WHERE "Orders"."UserId" = $1
    `;
    
    pool.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(result.rows);
        }
    });
});


export { router };