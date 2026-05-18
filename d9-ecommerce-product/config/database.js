import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8']);

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGO_DB, {
      dbName: 'Ecommerce-product'
    });
    console.log('MongoDB connected successfully');
  } catch(error) {
    console.error('Mongo connection fail', error);
    process.exit(1);
  }
};
export default connectDB;