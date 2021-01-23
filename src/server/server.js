// import log from 'console';
import express from 'express';
import jwt from 'express-jwt';
import cors from 'cors';
// import * as admin from 'firebase-admin';
import { createServer } from 'http';
import { connectDB } from '../database';
import { config } from '../config';
import createApolloServer from './createApolloServer';
import log from './logging';

export default async () => {
  const app = express();
  const mongo = await connectDB();

  // // eslint-disable-next-line
  // const serviceAccount = require('../../firebase_api_key.json');

  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   storageBucket: 'letheapi.appspot.com',
  // });

  // const bucket = admin.storage().bucket();

  // TODO: hack because MongoMemoryServer never returns. . .
  if (process.env.TEST !== 'true') {
    const db = mongo.mongoose.connection;
    db.on('error', () => log.error('Database connection failed 🙀'));
    db.once('open', () => log.info('Connected to the database 😺'));
  }

  const apolloServer = createApolloServer();

  const corsOptions = {
    origin: ['https://lethe.netlify.app', 'http://localhost:3000'],
    optionsSuccessStatus: 200,
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

  apolloServer.applyMiddleware({ app });
  const httpServer = createServer(app);
  // const engine = new ApolloEngine({
  //   apiKey: config.apolloEngineApiKey,
  // });

  apolloServer.installSubscriptionHandlers(httpServer);

  return { httpServer };
};
