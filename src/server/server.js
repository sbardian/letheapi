import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from '../graphql/schema';

export default () => {
  const server = express();

  console.log('schema = ', schema);

  // The GraphQL endpoint
  server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

  // GraphiQL, a visual editor for queries
  server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  return server;
};
