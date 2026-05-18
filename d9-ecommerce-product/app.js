import 'dotenv/config';
import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import notFound from './middlewares/nofFound.js';
import globalLimiter from './middlewares/rateLimit.js';
import helmet from 'helmet';
import requestLogger from './middlewares/logger.js';
import mongoSanitize from 'express-mongo-sanitize';
import { sanitizeHtml } from './middlewares/sanitizeHtml.js';
import router from './routes/index.js';

const app = express();
app.use(express.json());
app.use(helmet());
app.use(globalLimiter);
app.use(requestLogger);
app.use((req, res, next) => {
  req.body = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  next();
});
app.use(sanitizeHtml);

app.use('/api', router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;