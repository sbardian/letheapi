import { createServer } from './server';

const server = createServer();

server.listen(9999, 'localhost', () =>
  console.log('Server listening on port 9999'),
);
