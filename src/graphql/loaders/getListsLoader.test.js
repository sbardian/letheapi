import { testDatabase } from '../../database/testDatabase';
import { getListsLoader } from './';
import { returnLists } from '../../database/utils';
import { User, List } from '../../database/models';
import { insertMockLists, insertMockUsers } from '../../database/mocks';

jest.setTimeout(10000);

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
  mockLists = await List.insertMany(insertMockLists(4, users[0].id));
  loaders = { getListsLoader: getListsLoader({ List }) };
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

// TODO: calledTimes? what?
describe('getLists tests', () => {
  it('Confirm load called twice, is Admin with no filters', async () => {
    expect.assertions(4);
    mockLists.forEach(async list => {
      expect(returnLists(await loaders.getListsLoader.load(list.id))).toEqual(
        returnLists(list),
      );
    });
  });
});
