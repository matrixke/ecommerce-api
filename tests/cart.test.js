const request = require('supertest');
const app = require('../src/server');
const mongoose = require('mongoose');
const Cart = require('../src/models/Cart');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Cart Routes', () => {
  let userToken;
  let userId;
  let productId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_test');
    
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'user'
    });
    userId = user._id;
    userToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'testsecret');

    const product = await Product.create({
      name: 'Cart Test Product',
      description: 'Test Description',
      price: 49.99,
      category: 'electronics',
      stock: 15,
      sku: 'CART-001'
    });
    productId = product._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Cart.deleteMany({});
  });

  describe('POST /api/cart/add', () => {
    it('should add item to cart', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: productId.toString(),
          quantity: 2
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].quantity).toBe(2);
    });

    it('should not add item with insufficient stock', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: productId.toString(),
          quantity: 100
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/cart', () => {
    it('should get user cart', async () => {
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: productId.toString(),
          quantity: 1
        });

      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(1);
    });
  });
});
