import express from 'express';
import { ApolloEngine } from 'apollo-engine';
// import { ApolloServer } from 'apollo-server-express';
import { ApolloServer, PubSub, AuthenticationError } from 'apollo-server';
import jwt from 'express-jwt';
import { createServer } from 'http';
import { connectDB } from '../database';
import schema from '../graphql/schema';
import { Item, User, List, Invitation } from '../database/models';
import { config } from '../config';
import createLoaders from '../graphql/loaders/createLoaders';
import { verifyToken } from './verifyToken';

export const pubsub = new PubSub();

export default async () => {
  const app = express();

  // Configure mongo database connection
  await connectDB();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, connection }) => {
      if (connection) {
        return {
          models: { User },
          user: connection.context.user,
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
      };
    },
    tracing: true,
    cacheControl: true,
    formatError: err => {
      console.error(err);
      return err;
    },
    subscriptions: {
      path: '/subscriptions',
      onConnect: (connectionParams, webSocket, context) => {
        if (connectionParams.token) {
          console.log('onConnect called 📭');
          const decodedUser = verifyToken(connectionParams.token);
          return { user: decodedUser };
        }
        throw new AuthenticationError('Authentication failed.');
      },
      onDisconnect: (webSocket, context) => {
        console.log('onDisconnect called 📫');
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
