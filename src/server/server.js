import express from 'express';
import { ApolloEngine } from 'apollo-engine';
import { ApolloServer } from 'apollo-server-express';
import { PubSub } from 'apollo-server';
import jwt from 'express-jwt';
import faker from 'faker';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { connectDB } from '../database';
import schema from '../graphql/schema';
import { Item, User, List, Invitation } from '../database/models';
import { config } from '../config';
import createLoaders from '../graphql/loaders/createLoaders';

export const pubsub = new PubSub();

export default async () => {
  const app = express();

  // Configure mongo database connection
  await connectDB();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      // if (!req) {
      //   return {};
      // }
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

  // apolloServer.installSubscriptionHandlers(httpServer);

  setInterval(() => {
    const content = faker.lorem.words();
    pubsub.publish('MESSAGE_CREATED', {
      messageCreated: {
        content,
      },
    });
    // console.log('running... ', content);
  }, 1000);

  return { engine, app, httpServer, schema };
};
