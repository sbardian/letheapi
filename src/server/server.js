import express from 'express';

const app = express();

app.listen(9999, () => {
  console.log('Server is up and listening on port 9999');
});
