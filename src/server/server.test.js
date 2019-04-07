import createServer from './server';

jest.mock('../database');

test('Should return a server', async () => {
  expect(await createServer()).toBeTruthy();
});
