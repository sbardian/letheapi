import chalk from 'chalk';
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';
import { User } from './models';
import { config } from '../config';
import { insertMockUsers } from './mocks';

export default async () => {
  const { mockMode, databaseUrl } = config;
  mongoose.promise = global.Promise;
  if (mockMode) {
    const MONGO_DB_NAME = 'mockMongoDB';
    const MONGO_DB_PORT = '9088';
    const mongod = new MongodbMemoryServer({
      instance: {
        port: MONGO_DB_PORT,
        dbName: MONGO_DB_NAME,
        debug: true,
      },
    });
    const MONGO_MOCK_URI = await mongod.getConnectionString();
    console.log('connection string = ', MONGO_MOCK_URI);
    mongoose.connect(MONGO_MOCK_URI);
    mongoose.set('debug', true);
    await User.insertMany(insertMockUsers(2));
  } else {
    mongoose.connect(databaseUrl);
  }
  const db = mongoose.connection;
  db.on('error', () => console.log(chalk.red('Database connection error')));
  db.once('open', () => console.log(chalk.green('Connected to the database!')));
};
