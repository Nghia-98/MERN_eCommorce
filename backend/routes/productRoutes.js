import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getAllProducts,
} from '../controllers/productControllers.js';
import auth from '../middleware/authMiddleware.js';

// @desc: Fetch all products
// @route: GET /api/product
// @access: Public
router
  .route('/')
  .get(getProducts)
  .post(auth.isLogin, auth.isAdmin, createProduct);

router.get('/all', getAllProducts);

router.get('/top', getTopProducts);

router.route('/:id/reviews').post(auth.isLogin, createProductReview);

// @desc: Fetch, Delete single product
// @route: GET, DELETE /api/products/:id
router
  .route('/:id')
  .get(getProductById)
  .delete(auth.isLogin, auth.isAdmin, deleteProductById)
  .put(auth.isLogin, auth.isAdmin, updateProduct);

export default router;
