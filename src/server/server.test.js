import createServer from './server';

jest.mock('../database');

describe('Server tests', () => {
  it('Should return a server', async () => {
    expect(await createServer()).toBeTruthy();
  });
});
