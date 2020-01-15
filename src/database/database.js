import mongoose from 'mongoose';
// import MongoMemoryServer from 'mongodb-memory-server';
// import { User } from './models';
import { config } from '../config';
// import { insertMockUsers } from './mocks';

export default async () => {
  const { databaseUrl } = config;
  mongoose.promise = global.Promise;

  // Make Mongoose use `findOneAndUpdate()` from MongoDB driver.
  mongoose.set('useFindAndModify', false);

  console.log('MONGO DB >>>> ', databaseUrl);

  await mongoose.connect(databaseUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // if (process.env.NODE_ENV === 'test') {
  //   await User.find({}, (err, docs) => {
  //     if (!err && docs.length <= 0) {
  //       console.log('************ attempting to insert users *************');
  //       User.insertMany(insertMockUsers(2));
  //     }
  //   });
  // }
  return { mongoose };
};
