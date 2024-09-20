// routes/userRoutes.js
import express from 'express';
import { getLikedProducts, likeProduct, unlikeProduct } from '../controllers/likeProduct';
import authMiddleware from '../middleware/authMiddleware';

const likeRouter = express.Router();

likeRouter.post('/like/:productId', authMiddleware, likeProduct);

likeRouter.post('/unlike/:productId', authMiddleware, unlikeProduct);

likeRouter.get('/liked-products', authMiddleware, getLikedProducts);

export default likeRouter;
