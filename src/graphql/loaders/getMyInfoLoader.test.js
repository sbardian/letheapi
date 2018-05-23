import { testDatabase } from '../../database/testDatabase';
import { getMyInfoLoader } from './';
import { returnUsers } from '../../database/utils';
import { User, List } from '../../database/models';
import { insertMockUsers } from '../../database/mocks';

jest.setTimeout(10000);

let server;
let mockUsers;
let loaders;

beforeAll(async done => {
  server = await testDatabase();
  done();
});

afterAll(() => {
  server.mongoose.disconnect();
  server.mongoServer.stop();
});

beforeEach(async () => {
  mockUsers = await User.insertMany(insertMockUsers(2));
  loaders = { getMyInfoLoader: getMyInfoLoader({ User }) };
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('getMyInfoLoader tests', () => {
  it('Returns users', async () => {
    expect.assertions(2);
    return Promise.all(
      mockUsers.map(async user => {
        const returnedUser = await loaders.getMyInfoLoader.load(user.id);
        expect(returnUsers(returnedUser)).toEqual(returnUsers(user));
      }),
    );
  });
});
