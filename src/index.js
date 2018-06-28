import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { createServer } from './server';

createServer().then(({ engine, app, schema, httpServer }) =>
  // engine.listen(
  //   {
  //     port: 9999,
  //     expressApp: app,
  //   },
  //   () => {
  //     new SubscriptionServer(
  //       {
  //         execute,
  //         subscribe,
  //         schema,
  //       },
  //       {
  //         port: 9111,
  //         server: httpServer,
  //         path: '/subscriptions',
  //       },
  //     );
  //   },
  // ),
  engine.listen({ port: 9999, httpServer }, () => {
    console.log(`🚀 Server ready at http://localhost:9999/graphql`);
    // eslint-disable-next-line no-new
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: (connectionParams, webSocket, context) => {
          if (connectionParams.token) {
            return { valid: true };
          }
          throw new Error('Missing token!');
        },
      },
      {
        server: httpServer,
        path: '/subscriptions',
      },
    );
  }),
);
