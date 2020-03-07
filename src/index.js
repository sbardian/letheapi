import { createServer } from './server';

(async () => {
  const { engine, httpServer } = await createServer();
  engine.listen({ port: process.env.PORT, httpServer });
})();
