import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {webshopRouter} from './routes/webshop.js';
import {errorHandler} from './middleware/errorHandling.js';
import {requestLogger} from './middleware/requestLogger.js';

dotenv.config();

const PORT = process.env.PORT || 4002;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get('/health', (_req, res) => {
    res.json({status: 'ok', service: 'webshop-service', environment: NODE_ENV});
});

app.use('/webshop', webshopRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});
