import mongoose from 'mongoose';
import { config } from '../config';

export default async () => {
  const { databaseUrl } = config;
  mongoose.promise = global.Promise;

  await mongoose.connect(databaseUrl).catch((error) => {
    throw new Error('Unable to connect to database: ', error);
  });

  return { mongoose };
};
