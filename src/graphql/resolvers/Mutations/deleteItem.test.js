import createDB from '../../../database/database';
import { User, List, Item } from '../../../database/models';
import {
  insertMockLists,
  insertMockUsers,
  insertMockItems,
} from '../../../database/mocks';
import * as mockCheckAuth from '../checkAuth';
import { deleteItem } from './deleteItem';
import { pubsub as mockPubsub } from '../../../test-assets/mockPubSub';

jest.mock('../checkAuth');
jest.mock('../../../test-assets/mockPubSub');

let server;

beforeAll(async (done) => {
  server = await createDB();
  done();
});

afterAll(() => {
  server.mongoose.disconnect();
  // server.mongoServer.stop();
});

beforeEach(async () => {
  const users = await User.insertMany(insertMockUsers(1));
  const lists = await List.insertMany(insertMockLists(1, users));
  await Item.insertMany(insertMockItems(10, lists[0].id, users[0].id));
  await User.findByIdAndUpdate(users[0].id, {
    lists: [lists[0].id],
  });
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('Returns deleted item, user of list', () => {
  it('Returns nothing', async () => {
    mockCheckAuth.userOfListByItemId.mockImplementationOnce(() => true);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    const items = await Item.find();
    expect(
      await deleteItem(
        'root',
        { itemId: items[0].id },
        {
          models: { Item, User, List },
          user: { isAdmin: false },
          pubsub: mockPubsub,
        },
      ),
    ).toEqual(expect.objectContaining({ id: items[0].id }));
  });
  it('Returns deleted item, isAdmin', async () => {
    mockCheckAuth.userOfListByItemId.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    const items = await Item.find();
    expect(
      await deleteItem(
        'root',
        { itemId: items[0].id },
        {
          models: { Item, User, List },
          user: { isAdmin: true },
          pubsub: mockPubsub,
        },
      ),
    ).toEqual(expect.objectContaining({ id: items[0].id }));
  });
  it('Returns an error', async () => {
    expect.assertions(1);
    mockCheckAuth.userOfListByItemId.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    const items = await Item.find();
    try {
      await deleteItem(
        'root',
        { itemId: items[0].id },
        {
          models: { Item, User, List },
          user: { isAdmin: false },
          pubsub: mockPubsub,
        },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You do not have permission to delete this item.',
      );
    }
  });
});
