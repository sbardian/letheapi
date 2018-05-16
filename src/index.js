import { createServer } from './server';

createServer().then(({ engine, server }) =>
  engine.listen({
    port: 9999,
    expressApp: server,
  }),
);
