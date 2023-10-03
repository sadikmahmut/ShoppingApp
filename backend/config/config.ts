/**
 * File: config/config.ts
 * Description: This file generates a random secret key used for JWT token encryption.
 * Author: Sadık Mahmut
 * Date: 03.10.2023
 * Version: 1.0
 */


import crypto from 'crypto';

// Generate a random secret key with 32 bytes (256 bits)
const secretKey = crypto.randomBytes(32).toString('hex');

export const config = {
  secretKey: secretKey,
};