import { createServer } from './server';

createServer().then(({ engine, httpServer }) =>
  engine.listen({ port: 9999, httpServer }),
);
