import {
  ApolloServer,
  AuthenticationError,
  PubSub,
} from 'apollo-server-express';
import {
  Item,
  User,
  List,
  Invitation,
  BlacklistedToken,
} from '../database/models';
import createLoaders from '../graphql/loaders/createLoaders';
import { verifyToken } from './verifyToken';
import { config } from '../config';
import schema from '../graphql/schema';
import log from './logging';

export const pubsub = new PubSub();
// Configure ApolloServer
export default () =>
  new ApolloServer({
    schema,
    context: ({ req, connection }) => {
      if (connection) {
        return {
          models: { User },
          user: connection.context.user,
          log,
        };
      }
      let token;
      if (req?.headers?.authorization) {
        const { authorization } = req.headers;
        token = authorization.replace('Bearer ', '');
      }
      return {
        models: {
          Item,
          User,
          List,
          Invitation,
          BlacklistedToken,
        },
        user: req.user,
        pubsub,
        token,
        loaders: createLoaders(),
        log,
      };
    },
    tracing: true,
    cacheControl: true,
    ...(config.apolloEngineApiKey && { engine: config.apolloEngineApiKey }),
    introspection: true,
    formatError: (err) => {
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
      onConnect: (connectionParams) => {
        let token;
        if (connectionParams?.Authorization) {
          const { Authorization } = connectionParams;
          token = Authorization.replace('Bearer ', '');
        }
        if (token) {
          // log.info('onConnect called 📭');
          const decodedUser = verifyToken(token);
          return { user: decodedUser };
        }
        throw new AuthenticationError('Authentication failed.');
      },
      onDisconnect: () => {
        // log.info('onDisconnect called 📫');
      },
    },
  });
