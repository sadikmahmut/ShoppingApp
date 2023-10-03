import { expect } from 'chai';
import 'mocha';
import request from 'supertest';
import express from 'express';
import { router } from '../src/controllers/order.controller';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const app = express();


const userId = '8f6e744b-e6db-4046-a450-5a579edf4d2f';

function generateToken(userId) {
  const payload = {
    userId: userId
  };
  return jwt.sign(payload, config.secretKey, { expiresIn: '1h' });
}


app.use((req, res, next) => {
  const token = generateToken(userId);
  req.headers['authorization'] = token;
  next();
});

app.use('/api/Order', router);

describe('Order Controller', () => {
  describe('GET /api/Order/getAllOrders', () => {
    it('should retrieve all orders', (done) => {
      request(app)
        .get('/api/Order/getAllOrders')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /api/Order/getOrdersByUserId/:userId', () => {
    it('should retrieve orders by user ID', (done) => {

      request(app)
        .get(`/api/Order/getOrdersByUserId/${userId}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });
});
