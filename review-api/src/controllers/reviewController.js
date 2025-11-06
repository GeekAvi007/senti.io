import { reviewQueue } from '../jobs/queue.js';
import db from '../db/index.js'

export const createReview = async (req, res) => {
    try {
      const { product_id, review_text } = req.body;
      if(!product_id || !review_text) {
        return res.status(400).json({error: 'Product ID and Review Text are required!'});
      } 

      const insertQuery = 'INSERT INTO reviews(product_id,review_text, status) VALUES($1, $2, $3) RETURNING id';

      const result = await db.query(insertQuery, [product_id,review_text,'PENDING']);

      const reviewId = result.rows[0].id;

      await reviewQueue.add('analyzeReview', { review_id: reviewId, review_text});

      res.status(202).json({message: 'Review Accepted for processing', review_id :reviewId});
    } catch (error) {
        console.error('Error creating review : ', error);
        res.status(500).json({error: 'Internal Server Error!'})
    }
};

export const getReviewsByProduct = async (req, res) => {
    try {
      const { product_id } = req.params;
      const query = 'SELECT id, review_text, status FROM reviews WHERE product_id = $1 ORDER BY id DESC';
      const result = await db.query(query, [product_id]);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  export const getSentimentSummary = async (req, res) => {
    try {
      const { product_id } = req.params;
      const query = `
        SELECT
          COUNT(CASE WHEN status = 'POSITIVE' THEN 1 END) AS positive,
          COUNT(CASE WHEN status = 'NEGATIVE' THEN 1 END) AS negative,
          COUNT(CASE WHEN status = 'NEUTRAL' THEN 1 END) AS neutral
        FROM reviews
        WHERE product_id = $1
      `;
      const result = await db.query(query, [product_id]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching sentiment summary:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };