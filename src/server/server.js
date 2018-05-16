import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import mongoose from 'mongoose';
import jwt from 'express-jwt';
import { connectDB } from '../database';
import schema from '../graphql/schema';
import { Item, User, List, Invitation } from '../database/models';
import { config } from '../config';
import loaders from '../graphql/loaders/createLoaders';
import {
  getListItemsLoader,
  getListUsersLoader,
  getUserInvitationsLoader,
  getUserLoader,
  getUserListsLoader,
} from '../graphql/loaders';
export default async () => {
  const server = express();

  // Configure mongo database connection
  console.log(await connectDB());

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
        loaders: {
          getListItemsLoader: getListItemsLoader({ Item }),
          getListUsersLoader: getListUsersLoader({ User }),
          getUserLoader: getUserLoader({ User }),
          getUserListsLoader: getUserListsLoader({ List }),
          getUserInvitationsLoader: getUserInvitationsLoader({ Invitation }),
        },
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
