/**
 * File: src/controllers/product.controller.ts
 * Description: This file defines routes and handlers related to products.
 * It includes endpoints for managing products and ordering them.
 * Author: Sadık Mahmut
 * Date: 03.10.2023
 * Version: 1.0
 */


import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../helpers/db'
import { authenticateToken } from '../middleware/auth';


// Create an Express Router
const router = express.Router();


/**
 * Retrieves all active products.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/getAllProducts', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM "Products" WHERE "Active" = true';
  
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
 * Retrieves all active products by its Id.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/getProduct/:id', authenticateToken, (req, res) => {
    const productId = req.params.id;
  
    const query = 'SELECT * FROM "Products" WHERE "Id" = $1 AND "Active" = true';
  
    pool.query(query, [productId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Product not found' });
            } else {
                res.json(result.rows[0]);
            }
        }
    });
});
  
  
/**
 * Creates a new product.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.post('/createProduct', authenticateToken, (req, res) => {
    const { Name, Description, Price } = req.body;
  
    const Id = uuidv4();
  
    const Active = true;
  
    const query = 'INSERT INTO "Products" ("Id", "Name", "Description", "Price", "Active") VALUES ($1, $2, $3, $4, $5) RETURNING *';
  
    pool.query(query, [Id, Name, Description, Price, Active], (err, result) => {
        if (err) {
            console.error('Error inserting product:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(201).json(result.rows[0]);
        }
    });
});
  

/**
 * Updates an existing product by its ID.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.put('/updateProduct/:id', authenticateToken, (req, res) => {
    const { Name, Description, Price } = req.body;
    const productId = req.params.id;

    const query = 'UPDATE "Products" SET "Name" = $1, "Description" = $2, "Price" = $3 WHERE "Id" = $4 RETURNING *';

    pool.query(query, [Name, Description, Price, productId], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Product not found' });
            } else {
                res.status(200).json(result.rows[0]);
            }
        }
    });
});
  
  
/**
 * Deletes a product by its ID (sets it as inactive).
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.put('/deleteProduct/:id', authenticateToken, (req, res) => {
    const productId = req.params.id;
  
    const query = 'UPDATE "Products" SET "Active" = false WHERE "Id" = $1 RETURNING *';
  
    pool.query(query, [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Product not found' });
            } else {
                res.status(200).json(result.rows[0]);
            }
        }
    });
});



/**
 * This route allows users to place an order for a product. It begins a transaction to ensure data consistency.
 * It generates a unique order ID and sets the order status as 'Request Sent.' The order details are inserted into the "Orders" table.
 * Additionally, it deactivates the purchased product by setting its "Active" status to false in the "Products" table.
 * If any step in the transaction fails, it rolls back the transaction to maintain data integrity.
 * Upon a successful order creation, it commits the transaction and sends the order details as a JSON response.
 * 
 * @param {Object} req - The HTTP request object containing the user's request data.
 * @param {Object} res - The HTTP response object used to send the response.
 */
router.post('/orderProduct', authenticateToken, (req, res) => {
    const { userId, productId } = req.body;

    const orderId = uuidv4();

    const currentDate = new Date();

    const status = 'Request Sent';

    pool.query('BEGIN', (beginErr) => {
        if (beginErr) {
            console.error('Error starting transaction:', beginErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const orderQuery = `
            INSERT INTO "Orders" ("Id", "ProductId", "UserId", "Date", "Status")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        pool.query(
            orderQuery,
            [orderId, productId, userId, currentDate, status],
            (orderErr, orderResult) => {
                if (orderErr) {
                    console.error('Error inserting order:', orderErr);
                    // Rollback the transaction on error
                    pool.query('ROLLBACK', (rollbackErr) => {
                        if (rollbackErr) {
                            console.error('Error rolling back transaction:', rollbackErr);
                        }
                        res.status(500).json({ error: 'Internal Server Error' });
                    });
                    return;
                }

                const updateProductQuery = `
                    UPDATE "Products"
                    SET "Active" = false
                    WHERE "Id" = $1
                    RETURNING *
                `;

                pool.query(updateProductQuery, [productId], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error('Error updating product:', updateErr);
                        // Rollback the transaction on error
                        pool.query('ROLLBACK', (rollbackErr) => {
                            if (rollbackErr) {
                                console.error('Error rolling back transaction:', rollbackErr);
                            }
                            res.status(500).json({ error: 'Internal Server Error' });
                        });
                        return;
                    }

                    pool.query('COMMIT', (commitErr) => {
                        if (commitErr) {
                            console.error('Error committing transaction:', commitErr);
                            res.status(500).json({ error: 'Internal Server Error' });
                        } else {
                            // Send the order as a JSON response
                            res.status(201).json(orderResult.rows[0]);
                        }
                    });
                });
            }
        );
    });
});


export { router };