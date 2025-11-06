import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import reviewRoutes from './routes/reviewRoutes.js'
import { createLogger, transports, format} from 'winston'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const logger = createLogger({
    level:'info',
    format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()]
});

app.use(cors());
app.use(express.json());

app.use('/api', reviewRoutes);

app.use((err, res) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  logger.info(`Review API running on port ${port}`);
});