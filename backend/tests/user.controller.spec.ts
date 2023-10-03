import { expect } from 'chai';
import 'mocha';
import request from 'supertest';
import express from 'express';
import { router } from '../src/controllers/user.controller';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const app = express();

const testUserId = '8f6e744b-e6db-4046-a450-5a579edf4d2f';
const invalidUserId = '260e8e3a-7596-4f94-ad85-c50065f1d104';

app.use(express.json());

app.use('/api/User', router);

describe('User Controller', () => {
  describe('GET /api/User/getUser for Valid User', () => {
    it('should retrieve user information for the authenticated user', (done) => {
      const validUserToken = jwt.sign({ userId: testUserId }, config.secretKey, { expiresIn: '1h' });

      request(app)
        .get('/api/User/getUser')
        .set('Authorization', validUserToken) 
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('Id').to.equal(testUserId);
          done();
        });
    });
  });

  describe('GET /api/User/getUser for Invalid User', () => {
    it('should return a 404 error for an invalid user ID', (done) => {
      const invalidUserToken = jwt.sign({ userId: invalidUserId }, config.secretKey, { expiresIn: '1h' });

      request(app)
        .get('/api/User/getUser')
        .set('Authorization', invalidUserToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('error').to.equal('User not found');
          done();
        });
    });
  });
});
