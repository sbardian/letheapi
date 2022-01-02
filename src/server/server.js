// import log from 'console';
import express from 'express';
import jwt from 'express-jwt';
import cors from 'cors';
// import * as admin from 'firebase-admin';
import { createServer } from 'http';
import { connectDB } from '../database';
import { config } from '../config';
import createApolloServer, {
  createSubscriptionServer,
} from './createApolloServers';
// import createApolloServer from './createApolloServers';
import log from './logging';

require('dotenv').config();

export default async () => {
  const app = express();
  const mongo = await connectDB();

  if (process.env.TEST !== 'true') {
    const db = mongo.mongoose.connection;
    db.on('error', () => log.error('Database connection failed 🙀'));
    db.once('open', () => log.info('Connected to the database 😺'));
  }

  const httpServer = createServer(app);

  const subscriptionServer = createSubscriptionServer(httpServer);

  const apolloServer = createApolloServer(subscriptionServer);

  const corsOptions = {
    origin: ['https://lethe.netlify.app', 'https://studio.apollographql.com'],
    optionsSuccessStatus: 200,
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(
    '/graphql',
    jwt({
      secret: config.sessionSecret,
      credentialsRequired: false,
      algorithms: ['HS256'],
    }),
  );

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  return { httpServer };
};
