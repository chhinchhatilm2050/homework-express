import express from 'express';
const router = express.Router();
import authRouter from './authors.js'
import categoriesRouter from './categories.js'
import postsRouter from './posts.js'
router.use('/authors', authRouter);
router.use('/categories', categoriesRouter);
router.use('/posts', postsRouter);

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

export default router;