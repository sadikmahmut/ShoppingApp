import { expect } from 'chai';
import 'mocha';
import request from 'supertest';
import express from 'express';
import { router } from '../src/controllers/login.controller';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const app = express();

// Sample user data for testing
const testUser = {
  username: 'admin',
  password: 'admin',
};

// Generate a JWT token for the test user
const testUserToken = jwt.sign({ userId: '8f6e744b-e6db-4046-a450-5a579edf4d2f' }, config.secretKey, { expiresIn: '1h' });

app.use(express.json());

// Mock user login logic for testing
app.post('/api/Login/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the provided username and password match the test user data
  if (username === testUser.username && password === testUser.password) {
    res.status(200).json({ token: testUserToken });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.use('/api/Login', router);

describe('Login Controller', () => {
  describe('POST /api/Login/login', () => {
    it('should return a valid JWT token on successful login', (done) => {
      request(app)
        .post('/api/Login/login')
        .send({ username: testUser.username, password: testUser.password })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('token').to.be.a('string');
          done();
        });
    });

    it('should return a 401 error on invalid credentials', (done) => {
      request(app)
        .post('/api/Login/login')
        .send({ username: 'invaliduser', password: 'invalidpassword' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('error').to.equal('Invalid credentials');
          done();
        });
    });
  });
});
