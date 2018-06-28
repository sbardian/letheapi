import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { createServer } from './server';

createServer().then(({ engine, app, schema, httpServer, apolloServer }) =>
  engine.listen({ port: 9999, httpServer }),
);
