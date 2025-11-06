import { Queue } from 'bullmq'
import IORedis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL);

export const reviewQueue = new Queue('reviewQueue', { connection })