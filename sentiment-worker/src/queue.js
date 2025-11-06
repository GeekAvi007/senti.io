import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import { processReviewSentiment } from './sentimentProcessor.js';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  });

/**
 * Sets up the BullMQ worker for processing review sentiment analysis jobs.
 * Listens on the 'reviewQueue' queue, calls processReviewSentiment on each job.
 */
export const reviewWorker = new Worker(
  'reviewQueue',
  async job => {
    const { review_id, review_text } = job.data;
    try {
      await processReviewSentiment(review_id, review_text);
      console.log(`Processed sentiment for review ID: ${review_id}`);
    } catch (error) {
      console.error(`Error processing review ID ${review_id}:`, error);
      // Throwing error will cause BullMQ to mark job as failed and can trigger retries
      throw error;
    }
  },
  { connection }
);

reviewWorker.on('completed', job => {
  console.log(`Job completed: ${job.id}`);
});

reviewWorker.on('failed', (job, err) => {
  console.error(`Job failed: ${job.id} with error: ${err.message}`);
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await reviewWorker.close();
  process.exit(0);
});
