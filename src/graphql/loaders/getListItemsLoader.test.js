import { testDatabase } from '../../database/testDatabase';
import { getListItemsLoader } from './';
import { returnItems } from '../../database/utils';
import { User, List, Item } from '../../database/models';
import {
  insertMockLists,
  insertMockUsers,
  insertMockItems,
} from '../../database/mocks';

jest.setTimeout(12000);

let server;
let mockUsers;
let mockLists;
let mockItems;
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
  Promise.all(
    mockUsers.map(async user =>
      User.findByIdAndUpdate(user.id, {
        lists: mockLists.map(list => list.id),
      }),
    ),
  );
  mockLists.map(async list =>
    Item.insertMany(insertMockItems(5, list, mockUsers)),
  );
  mockLists = await List.find();
  mockItems = await Item.find();
  loaders = { getListItemsLoader: getListItemsLoader({ Item }) };
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('getListItemsLoader test', () => {
  it('Returns items', async () => {
    expect.assertions(1);
    return Promise.all(
      mockLists.map(async list => {
        const items = await loaders.getListItemsLoader.load(list.id);
        expect(items.map(returnItems)).toEqual(mockItems.map(returnItems));
      }),
    );
  });
});
