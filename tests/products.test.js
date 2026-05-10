const request = require('supertest');
const app = require('../src/server');
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Product Routes', () => {
  let adminToken;
  let adminId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_test');
    
    const admin = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      role: 'admin'
    });
    adminId = admin._id;
    adminToken = jwt.sign({ userId: adminId }, process.env.JWT_SECRET || 'testsecret');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      await Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category: 'electronics',
        stock: 10,
        sku: 'TEST-001'
      });

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toHaveLength(1);
    });

    it('should filter products by category', async () => {
      await Product.create({
        name: 'Electronics Product',
        description: 'Test',
        price: 99.99,
        category: 'electronics',
        stock: 10,
        sku: 'ELEC-001'
      });

      await Product.create({
        name: 'Clothing Product',
        description: 'Test',
        price: 49.99,
        category: 'clothing',
        stock: 20,
        sku: 'CLOTH-001'
      });

      const res = await request(app).get('/api/products?category=electronics');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0].category).toBe('electronics');
    });
  });

  describe('POST /api/products', () => {
    it('should create product when admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Product',
          description: 'New Description',
          price: 149.99,
          category: 'electronics',
          stock: 5,
          sku: 'NEW-001'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'New Product');
    });
  });
});
