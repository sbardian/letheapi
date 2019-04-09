import mongoose from 'mongoose';
import MongoMemoryServer from 'mongodb-memory-server';
import { User } from './models';
import { config } from '../config';
import { insertMockUsers } from './mocks';

export default async () => {
  const { mockMode, databaseUrl } = config;
  mongoose.promise = global.Promise;

  // Make Mongoose use `findOneAndUpdate()` from MongoDB driver.
  mongoose.set('useFindAndModify', false);

  if (mockMode) {
    console.log('mockMode = true');
    const mongod = new MongoMemoryServer({
      // debug: true,
    });
    const MONGO_MOCK_URI = await mongod.getConnectionString();

    mongoose.connect(MONGO_MOCK_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
    await User.insertMany(insertMockUsers(2));
  } else {
    mongoose.connect(databaseUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
  }
  return mongoose;
};
