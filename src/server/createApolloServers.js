import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { PubSub } from 'graphql-subscriptions';
import { execute, subscribe } from 'graphql';
import * as admin from 'firebase-admin';
import {
  Item,
  User,
  List,
  Invitation,
  BlacklistedToken,
} from '../database/models';
import createLoaders from '../graphql/loaders/createLoaders';
import { decodeToken } from './verifyToken';
import { config } from '../config';
import schema from '../graphql/schema';
import log from './logging';

export const pubsub = new PubSub();

// eslint-disable-next-line
const serviceAccount = require('../../firebase_api_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'letheapi.appspot.com',
});

const bucket = admin.storage().bucket();

// Configure ApolloServer
export default (subscriptionServer) =>
  new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: ({ req, connection }) => {
      if (connection) {
        return {
          models: { User, List, BlacklistedToken, Invitation, Item },
          loaders: createLoaders(),
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
        bucket,
        pubsub,
        token,
        loaders: createLoaders(),
        log,
      };
    },
    tracing: true,
    cacheControl: true,
    ...(config.apolloKey && {
      apollo: {
        key: config.apolloKey,
        graphId: config.apolloId,
        graphVariant: config.apolloGraphVariant,
      },
    }),
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
  });

export const createSubscriptionServer = (httpServer) =>
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect(connectionParams) {
        // let token;
        let user;
        const { token } = connectionParams;
        if (token) {
          user = decodeToken(token);
        }
        if (user && token) {
          console.log('user and token, you are good!');
          return {
            models: {
              Item,
              User,
              List,
              Invitation,
              BlacklistedToken,
            },
            user,
            pubsub,
            loaders: createLoaders(),
            token,
            log,
          };
        }
        console.log('no user and or token, you suck...');
        return new AuthenticationError(
          'You must Authenticate to use Subscriptions',
        );
      },
    },
    {
      server: httpServer,
      path: '/graphql',
    },
  );
