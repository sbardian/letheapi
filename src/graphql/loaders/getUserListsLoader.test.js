import { testDatabase } from '../../database/testDatabase';
import { getUserListsLoader } from './';
import { returnLists } from '../../database/utils';
import { User, List } from '../../database/models';
import { insertMockLists, insertMockUsers } from '../../database/mocks';

jest.setTimeout(10000);

let server;
let mockUsers;
let mockLists;
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
  mockUsers = await User.insertMany(insertMockUsers(1));
  mockLists = await List.insertMany(insertMockLists(1, mockUsers));
  loaders = { getUserListsLoader: getUserListsLoader({ List }) };
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('getLists tests', () => {
  it('DataLoader returns users lists', async () => {
    const list = returnLists(
      await loaders.getUserListsLoader.load(mockUsers[0].id),
    );
    expect(list).toEqual(returnLists(mockLists));
  });
});
