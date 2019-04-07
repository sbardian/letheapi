import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';

export const testDatabase = () => {
  const mongoServer = new MongodbMemoryServer();
  mongoServer
    .getConnectionString()
    .then(mongoUri => mongoose.connect(mongoUri, { useNewUrlParser: true }));
  return { mongoServer, mongoose };
};
