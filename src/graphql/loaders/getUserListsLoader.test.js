import { testDatabase } from '../../database/testDatabase';
import { getUserListsLoader } from './getUserListsLoader';
import { returnLists } from '../../database/utils';
import { User, List } from '../../database/models';
import { insertMockLists, insertMockUsers } from '../../database/mocks';

jest.setTimeout(35000);

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
  mockUsers = await User.insertMany(insertMockUsers(2));
  mockLists = await List.insertMany(insertMockLists(2, mockUsers));
  loaders = { getUserListsLoader: getUserListsLoader({ List }) };
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('getLists tests', () => {
  it('DataLoader returns users lists', async () => {
    expect.assertions(2);
    return Promise.all(
      mockUsers.map(async user => {
        const lists = await loaders.getUserListsLoader.load(user.id);
        expect(lists.map(returnLists)).toEqual(mockLists.map(returnLists));
      }),
    );
  });
});
