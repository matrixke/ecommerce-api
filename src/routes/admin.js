const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/products/:id/upload', auth, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
    product.images.push(...imageUrls);
    await product.save();

    res.json({ message: 'Images uploaded successfully', images: imageUrls });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
});

router.get('/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: revenueData[0]?.totalRevenue || 0
      },
      recentOrders,
      ordersByStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

router.get('/low-stock', auth, adminOnly, async (req, res) => {
  try {
    const threshold = req.query.threshold || 10;
    const products = await Product.find({ 
      stock: { $lte: threshold },
      isActive: true
    }).sort({ stock: 1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock products', error: error.message });
  }
});

router.get('/sales-report', auth, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = { paymentStatus: 'completed' };
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const salesData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(salesData);
  } catch (error) {
    res.status(500).json({ message: 'Error generating sales report', error: error.message });
  }
});

module.exports = router;
