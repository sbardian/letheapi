import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import mongoose from 'mongoose';
import schema from '../graphql/schema';
import Item from '../database/model';
import { shoppingItems } from '../database/mocks';

export default () => {
  const server = express();

  console.log('shoppingItems = ', shoppingItems);

  mongoose.promise = global.Promise;
  const db_url = 'mongodb://localhost/shoppinglist';
  mongoose.connect(db_url);
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', () => {
    console.log('Connected to the database!');
  });

  Item.insertMany(shoppingItems);

  // The GraphQL endpoint
  server.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({
      schema,
      formatError: err => {
        console.error('THATS AN ERROR = ', err);
        return err;
      },
    }),
  );

  // GraphiQL, a visual editor for queries
  server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  return server;
};
