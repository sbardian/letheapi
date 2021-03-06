import createDB from '../../database/database';
import { getListsLoader } from './getListsLoader';
import { returnLists } from '../../database/utils';
import { User, List } from '../../database/models';
import { insertMockLists, insertMockUsers } from '../../database/mocks';

let server;
let mockLists;
let loaders;

beforeAll(async done => {
  server = await createDB();
  done();
});

afterAll(() => {
  server.mongoose.disconnect();
  // server.mongoServer.stop();
});

beforeEach(async () => {
  const users = await User.insertMany(insertMockUsers(1));
  mockLists = await List.insertMany(insertMockLists(4, users));
  loaders = { getListsLoader: getListsLoader({ List }) };
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('getListsLoader tests', () => {
  it('DataLoader returns list it receives', async () => {
    expect.assertions(4);
    mockLists.forEach(async list => {
      expect(returnLists(await loaders.getListsLoader.load(list.id))).toEqual(
        returnLists(list),
      );
    });
  });
});
