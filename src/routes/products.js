const express = require('express');
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      minPrice, 
      maxPrice, 
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingReview = product.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.review = review;
    } else {
      product.ratings.push({ user: req.user._id, rating, review });
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});

module.exports = router;
