import createServer from './server';
import mockConnectDB from '../database';

jest.mock('../database');

test('Should return a server', async () => {
  expect(await createServer()).toBeTruthy();
});
