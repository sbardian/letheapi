import { createServer } from './server';

(async () => {
  const { engine, httpServer } = await createServer();
  engine.listen({ port: 9999, httpServer });
})();
