// import log from 'console';
import express from 'express';
import { ApolloEngine } from 'apollo-engine';
import { PubSub } from 'apollo-server-express';
import jwt from 'express-jwt';
import { createServer } from 'http';
import { connectDB } from '../database';
import { config } from '../config';
import createApolloServer from './createApolloServer';
import log from './logging';

export const pubsub = new PubSub();

export default async () => {
  const app = express();
  const mongo = await connectDB();

  console.log('>>>>> ', process.env.NODE_ENV);

  // TODO: hack because MongoMemoryServer never returns. . .
  if (process.env.NODE_ENV !== 'test') {
    const db = mongo.mongoose.connection;
    db.on('error', () => log.error('Database connection failed 🙀'));
    db.once('open', () => log.info('Connected to the database 😺'));
  }

  const apolloServer = createApolloServer();

  app.use(
    '/graphql',
    jwt({
      secret: config.sessionSecret,
      credentialsRequired: false,
    }),
  );

  apolloServer.applyMiddleware({ app });
  const httpServer = createServer(app);
  const engine = new ApolloEngine({
    apiKey: config.apolloEngineApiKey,
  });

  apolloServer.installSubscriptionHandlers(httpServer);

  return { engine, httpServer };
};
