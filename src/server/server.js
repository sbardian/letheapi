import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import mongoose from 'mongoose';
import jwt from 'express-jwt';
import { connectDB } from '../database';
import schema from '../graphql/schema';
import { Item, User } from '../database/models';
import { JWT_SECRET } from '../config/config';

export default () => {
  const server = express();

  // Configure mongo database connection
  const db = connectDB();
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to the database!');
  });

  // The GraphQL endpoint
  server.use(
    '/graphql',
    bodyParser.json(),
    jwt({
      secret: JWT_SECRET,
      credentialsRequired: false,
    }),
    graphqlExpress(req => ({
      schema,
      context: {
        Item,
        User,
        userObj: req.user
          ? User.findOne({ id: req.user.id })
          : Promise.resolve(null),
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
