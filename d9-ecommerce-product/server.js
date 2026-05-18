import app from './app.js';
import connectDB from './config/database.js';

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server run on port ${PORT} [${ENV}]`);
    });
  } catch(err) {
    console.error('Server failed to start:', err.message);
    process.exit(1);
  }
};
startServer();

