const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getFeaturedCategories
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.route('/featured').get(getFeaturedCategories);

router.route('/:id')
  .get(getCategory)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

router.route('/slug/:slug').get(getCategoryBySlug);

module.exports = router;