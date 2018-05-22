import { testDatabase } from '../../database/testDatabase';
import { getListsLoader } from './';
import { returnLists } from '../../database/utils';
import { User, List } from '../../database/models';
import { insertMockLists, insertMockUsers } from '../../database/mocks';

jest.setTimeout(5000);

let server;
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
  const users = await User.insertMany(insertMockUsers(1));
  mockLists = await List.insertMany(insertMockLists(4, users));
  loaders = { getListsLoader: getListsLoader({ List }) };
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('getLists tests', () => {
  it('DataLoader returns list it receives', async () => {
    expect.assertions(4);
    mockLists.forEach(async list => {
      expect(returnLists(await loaders.getListsLoader.load(list.id))).toEqual(
        returnLists(list),
      );
    });
  });
});
