import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { connectDB } from './config/database.js';
import 'dotenv/config'
await connectDB();
const logger = morgan('combined');
const requestHeader = helmet();
const app = express();
app.use(logger);
app.use(requestHeader);
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Application listen on port ${PORT}`);
});