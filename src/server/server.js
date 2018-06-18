import express from 'express';
import { ApolloEngine } from 'apollo-engine';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'express-jwt';
import { connectDB } from '../database';
import schema from '../graphql/schema';
import { Item, User, List, Invitation } from '../database/models';
import { config } from '../config';
import createLoaders from '../graphql/loaders/createLoaders';

export default async () => {
  const server = express();

  // Configure mongo database connection
  await connectDB();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({
      models: {
        Item,
        User,
        List,
        Invitation,
      },
      user: req.user,
      loaders: createLoaders(),
    }),
    tracing: true,
    cacheControl: true,
    formatError: err => {
      console.error(err);
      return err;
    },
  });

  // The GraphQL endpoint
  server.use(
    '/graphql',
    jwt({
      secret: config.sessionSecret,
      credentialsRequired: false,
    }),
  );

  apolloServer.applyMiddleware({ app: server });

  const engine = new ApolloEngine({
    apiKey: config.apolloEngineApiKey,
  });

  return { engine, server };
};
