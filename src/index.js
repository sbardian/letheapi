import { createServer } from './server';

(async () => {
  const { httpServer } = await createServer();
  httpServer.listen({ port: process.env.PORT });
})();
