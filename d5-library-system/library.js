import express from 'express';
import 'dotenv/config';
import { bookRoutes } from './routes/book.js';
import { memberRoutes } from './routes/member.js';
import { borrowingRoutes } from './routes/borrowing.js';
const app = express();
app.use(express.json());
const PORT = 3000;
app.use('/api', bookRoutes);
app.use('/api', memberRoutes);
app.use('/api', borrowingRoutes)
app.listen(PORT, () => {
    console.log(`Application listen on port${PORT}`)
})