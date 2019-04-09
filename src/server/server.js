// import log from 'console';
import express from 'express';
import { ApolloEngine } from 'apollo-engine';
import {
  ApolloServer,
  PubSub,
  AuthenticationError,
} from 'apollo-server-express';
import jwt from 'express-jwt';
import { createServer } from 'http';
import { connectDB } from '../database';
import log from './logging';
import schema from '../graphql/schema';
import { Item, User, List, Invitation } from '../database/models';
import { config } from '../config';
import createLoaders from '../graphql/loaders/createLoaders';
import { verifyToken } from './verifyToken';

export const pubsub = new PubSub();

export default async () => {
  log.info('starting server...');

  const app = express();

  const { mockMode } = config;

  // Configure and connect to mongo database
  const mongoose = await connectDB();
  if (!mockMode) {
    const db = mongoose.connection;

    db.on('error', () => log.error('Database connection failed 🙀'));
    db.once('open', () => log.info('Connected to the database 😺'));
  }

  // Configure ApolloServer
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, connection }) => {
      if (connection) {
        return {
          models: { User },
          user: connection.context.user,
          log,
        };
      }
      return {
        models: {
          Item,
          User,
          List,
          Invitation,
        },
        user: req.user,
        loaders: createLoaders(),
        log,
      };
    },
    tracing: true,
    cacheControl: true,
    formatError: err => {
      log.error(err);
      return err;
    },
    playground: {
      settings: {
        // temp fix for prismagraphql/graphql-playground#790
        'editor.cursorShape': 'line',
      },
    },
    subscriptions: {
      path: '/subscriptions',
      onConnect: connectionParams => {
        if (connectionParams.token) {
          log.info('onConnect called 📭');
          const decodedUser = verifyToken(connectionParams.token);
          return { user: decodedUser };
        }
        throw new AuthenticationError('Authentication failed.');
      },
      onDisconnect: () => {
        log.info('onDisconnect called 📫');
      },
    },
  });

  // The GraphQL endpoint
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

  return { engine, app, httpServer, schema, apolloServer };
};
