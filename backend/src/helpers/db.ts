/**
 * File: src/helpers/db.ts
 * Description: This file initializes a connection pool to the PostgreSQL database used by the application.
 * Author: Sadık Mahmut
 * Date: 03.10.2023
 * Version: 1.0
 */


import * as pg from 'pg';


// Create a PostgreSQL database connection pool with the specified configuration
const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ShoppingAppDb',
  password: '12345',
  port: 5432,
});

export default pool;