/**
 * File: src/app.ts
 * Description: This file serves as the entry point for the application.
 * It sets up the Express server, configures middleware, defines routes, tests the database connection,
 * and checks/inserts an admin user if it doesn't exist.
 * Author: Sadık Mahmut
 * Date: 03.10.2023
 * Version: 1.0
 */


import express from 'express';
import cors from 'cors'; 
import bodyParser from 'body-parser';
import pool from '../src/helpers/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { router as productRouter } from '../src/controllers/product.controller';
import { router as orderRouter } from '../src/controllers/order.controller';
import { router as registerRouter } from '../src/controllers/register.controller';
import { router as loginRouter } from '../src/controllers/login.controller';
import { router as userRouter } from '../src/controllers/user.controller';


// Create an Express application
const app = express();
const port = 3000;


// Middleware setup
app.use(cors());
app.use(bodyParser.json());


// Define routes for controllers
app.use('/api/Product', productRouter);
app.use('/api/Order', orderRouter);
app.use('/api/Register', registerRouter);
app.use('/api/Login', loginRouter);
app.use('/api/User', userRouter);


// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});


// Check and insert an admin user if not exists
async function checkAndInsertAdminUser() {
  try {
    const adminUserCheckQuery = 'SELECT * FROM "Users" WHERE "Role" = $1';
    const adminUser = await pool.query(adminUserCheckQuery, ['admin']);

    if (adminUser.rowCount === 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin', saltRounds);

      const insertAdminUserQuery =
        'INSERT INTO "Users" ("Id", "Username", "Email", "PasswordHash", "FirstName", "LastName", "Active", "CreatedDate", "Role") ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const currentDate = new Date();
      const values = [
        '8f6e744b-e6db-4046-a450-5a579edf4d2f',
        'admin',
        'admin@mail.com',
        hashedPassword,
        'admin',
        'admin',
        true,
        currentDate,
        'admin'
      ];

      await pool.query(insertAdminUserQuery, values);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error checking and inserting admin user:', error);
  }
}


// Call the function to check and insert an admin user
checkAndInsertAdminUser();


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});