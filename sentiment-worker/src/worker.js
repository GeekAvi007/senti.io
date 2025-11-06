import dotenv from 'dotenv';
dotenv.config();

import { Worker } from 'bullmq';
import { processReviewSentiment } from './sentimentProcessor.js';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL);

const worker = new Worker('reviewQueue', async job => {
  const { review_id, review_text } = job.data;
  try {
    await processReviewSentiment(review_id, review_text);
    console.log(`Processed review ${review_id} with sentiment analysis`);
  } catch (err) {
    console.error('Error processing review:', err);
    throw err;
  }
}, { connection });

worker.on('completed', job => {
  console.log(`Job completed: ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`Job failed: ${job.id} - ${err.message}`);
});

process.on('SIGINT', async () => {
  await worker.close();
  process.exit(0);
});
