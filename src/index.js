import { createServer } from './server';

const server = createServer();

server.listen(9091, 'localhost', () =>
  console.log('Server listening on port 9999'),
);
