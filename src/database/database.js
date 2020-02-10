import mongoose from 'mongoose';
import { config } from '../config';

export default async () => {
  const { databaseUrl } = config;
  mongoose.promise = global.Promise;

  // Make Mongoose use `findOneAndUpdate()` from MongoDB driver.
  mongoose.set('useFindAndModify', false);

  await mongoose.connect(databaseUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return { mongoose };
};
