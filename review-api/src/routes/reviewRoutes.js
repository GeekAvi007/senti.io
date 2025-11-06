import express from 'express'
import { createReview, getReviewsByProduct, getSentimentSummary } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/reviews', createReview);
router.get('/reviews/:product_id', getReviewsByProduct);
router.get('/sentiment/:product_id', getSentimentSummary);

export default router;