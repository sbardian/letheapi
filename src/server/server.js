import express from 'express';
import bodyParser from 'body-parser';
import { ApolloEngine } from 'apollo-engine';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
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

  // The GraphQL endpoint
  server.use(
    '/graphql',
    bodyParser.json(),
    jwt({
      secret: config.sessionSecret,
      credentialsRequired: false,
    }),
    graphqlExpress(req => ({
      schema,
      context: {
        models: {
          Item,
          User,
          List,
          Invitation,
        },
        user: req.user,
        loaders: createLoaders(),
      },
      tracing: true,
      cacheControl: true,
      formatError: err => {
        console.error(err);
        return err;
      },
    })),
  );

  // GraphiQL, a visual editor for queries
  server.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
    }),
  );

  const engine = new ApolloEngine({
    apiKey: config.apolloEngineApiKey,
  });

  return { engine, server };
};
