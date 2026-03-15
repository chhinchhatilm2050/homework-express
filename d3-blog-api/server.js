import express from 'express';
import router from './routes/index.js';
const app = express();

const PORT = 3000;
const logRequest =(req, res, next) => {
  console.log(req.ip);
  next();
};
app.use(logRequest)
app.use(express.json());
app.use('/api', router);
app.get('/', (req, res) => {
    res.json({
        message: 'Blog API',
        version: '1.0.0',
        endpoints: {
        authors: '/api/authors',
        categories: '/api/categories',
        posts: '/api/posts'
    }
    });
});
app.listen(PORT, () => {
    console.log(`Blog API running on http://localhost:${PORT}`);
})
export default router;