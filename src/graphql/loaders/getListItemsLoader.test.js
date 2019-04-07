import { testDatabase } from '../../database/testDatabase';
import { getListItemsLoader } from './getListItemsLoader';
import { returnItems } from '../../database/utils';
import { User, List, Item } from '../../database/models';
import {
  insertMockLists,
  insertMockUsers,
  insertMockItems,
} from '../../database/mocks';

let server;
let mockUsers;
let mockLists;
let mockItems = [];
let loaders;

jest.setTimeout(25000);

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
  mockLists = await List.insertMany(insertMockLists(9, mockUsers));
  await Promise.all(
    mockUsers.map(async user =>
      User.findByIdAndUpdate(user.id, {
        lists: mockLists.map(list => list.id),
      }),
    ),
  );

  await Promise.all(
    mockLists.map(async list => {
      const items = await Item.insertMany(insertMockItems(10, list, mockUsers));
      mockItems = {
        ...mockItems,
        [list.id]: items,
      };
    }),
  );

  loaders = { getListItemsLoader: getListItemsLoader({ Item }) };
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('getListItemsLoader test', () => {
  it('Returns items', async () => {
    expect.assertions(9);
    return Promise.all(
      mockLists.map(async list => {
        const items = await loaders.getListItemsLoader.load(list.id);
        expect(items.map(returnItems)).toEqual(
          mockItems[list.id].map(returnItems),
        );
      }),
    );
  });
});
