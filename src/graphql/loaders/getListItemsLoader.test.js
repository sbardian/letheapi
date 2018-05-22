import { testDatabase } from '../../database/testDatabase';
import { getListItemsLoader } from './';
import { returnItems } from '../../database/utils';
import { User, List, Item } from '../../database/models';
import {
  insertMockLists,
  insertMockUsers,
  insertMockItems,
} from '../../database/mocks';

jest.setTimeout(10000);

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
  mockUsers = await User.insertMany(insertMockUsers(2));
  mockLists = await List.insertMany(insertMockLists(2, mockUsers));
  Promise.all(
    mockUsers.map(async user =>
      User.findByIdAndUpdate(user.id, {
        lists: mockLists.map(list => list.id),
      }),
    ),
  );
  mockItems = await Item.insertMany(
    insertMockItems(5, mockLists[0], mockUsers),
  );
  console.log('FOUND Items = ', await )
  loaders = { getListItemsLoader: getListItemsLoader({ Item }) };
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('getListItemsLoader test', () => {
  it('Returns items', async () => {
    expect.assertions(5);
    Promise.all(
      mockItems.map(async item => {
        const items = await loaders.getListItemsLoader.load(item.id);
        console.log('items = ', items);
        expect(items.map(returnItems)).toEqual(mockItems.map(returnItems));
      }),
    );
  });
});

