import { createServer } from './server';

// const server = createServer().then(server);

createServer().then(server =>
  server.listen(9999, 'localhost', () =>
    console.log('Server listening on port 9999'),
  ),
);

// server.listen(9999, 'localhost', () =>
//   console.log('Server listening on port 9999'),
// );
