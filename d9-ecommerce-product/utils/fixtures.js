import { faker } from '@faker-js/faker';
import 'dotenv/config';
import  connectDB from '../config/database.js';
import bcrypt from 'bcrypt';
await connectDB();
import UserModel from '../model/User.js';

const numberOfUsers = 500;
const hashPassword = await bcrypt.hash('Password123', 12);
const generateUsers = () => {
  return {
    name: faker.person.fullName().slice(0, 50),
    email: faker.internet.email().toLowerCase(),
    password: hashPassword,
    bio: faker.helpers.maybe(() => faker.lorem.sentence({ min: 5, max: 20 }).slice(0, 500), { probability: 0.7 }),
    avatar: faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.6 }),
    role: faker.helpers.weightedArrayElement([
      { weight: 100, value: 'user' }
    ]),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
  };
};

const users = [];

for (let i = 0; i < numberOfUsers; i++) {
  users.push(generateUsers());
};

try {
  await UserModel.insertMany(users);
} catch (error) {
  console.error('Error seeding products:', error);
  process.exit(1);
}