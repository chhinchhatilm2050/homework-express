import express from 'express';
import { requestLogger, startupLog } from './middleware/logger.js';
import { globalLimiter, authLimiter } from './middleware/rateLimit.js';
import { AppError,errorHandler, notFound } from './middleware/errorHandler.js';
import { users} from './middleware/auth.js';
import { publicRouter } from './routes/public.js';
import { userRouter } from './routes/users.js';
import { adminRouter } from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

app.use(express.json());
app.use(requestLogger);
app.use(globalLimiter);

app.get('/', (req, res) => {
    res.json({
      message: 'API with Middleware System',  
      version: '1.0.0',
      timestamp: new Date().toDateString()
    })
})

app.post('/api/auth/login', authLimiter, (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return next(new AppError('Email and Password are require'))
        }
        const user = users.find(u => u.email === email);
        if(!user || password !== 'password123') {
            return next(new AppError('Invalid credentials', 401));
        }
        res.json({
            success: true,
            token: user.token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    }catch(err) {
        next(new AppError('Login failed', 500))
    }
})
app.use('/api/public', publicRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
    startupLog(PORT, ENV);
    console.log('\n📋 Available test credentials:');
    console.log('Admin: admin@example.com / password123 (token: admin-token-456)');
    console.log('User:  user@example.com / password123 (token: user-token-123)');
})

