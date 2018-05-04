import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import mongoose from 'mongoose';
import jwt from 'express-jwt';
import { connectDB } from '../database';
import schema from '../graphql/schema';
import { Item, User, List } from '../database/models';
import { config } from '../config';

export default () => {
  const server = express();

  // Configure mongo database connection
  console.log(connectDB());

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
        },
        user: req.user,
        isAdmin: req.user.isAdmin,
      },
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

  return server;
};
