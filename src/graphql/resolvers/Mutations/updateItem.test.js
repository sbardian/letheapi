import { testDatabase } from '../../../database/testDatabase';
import { updateItem } from './updateItem';
import { User, List, Item } from '../../../database/models';
import {
  insertMockUsers,
  insertMockLists,
  insertMockItems,
} from '../../../database/mocks';
import * as mockCheckAuth from '../checkAuth';
import { pubsub as mockPubsub } from '../../../server/server';

jest.mock('../checkAuth');
jest.mock('../../../server/server');

let server;
let toUpdate;

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
  const lists = await List.insertMany(insertMockLists(2, users));
  await User.findByIdAndUpdate(users[0].id, {
    lists: [lists[0].id, lists[1].id],
  });
  const items = await Item.insertMany(insertMockItems(1, lists[0], users));
  [toUpdate] = items;
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('updateList tests', () => {
  it('Should update an item, isAdmin', async () => {
    mockCheckAuth.userOfListByItemId.mockImplementationOnce(() => false);
    mockPubsub.publish.mockImplementationOnce(() => false);
    await updateItem(
      'root',
      { itemId: toUpdate.id, title: 'NEW TITLE' },
      { models: { Item, List, User }, user: { isAdmin: true } },
    );
    expect((await Item.findById(toUpdate.id)).title).toEqual('NEW TITLE');
  });
  it('Should update an item, is user of list', async () => {
    mockCheckAuth.userOfListByItemId.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    await updateItem(
      'root',
      { itemId: toUpdate.id, title: 'NEW TITLE' },
      { models: { Item, List, User }, user: { isAdmin: false } },
    );
    expect((await Item.findById(toUpdate.id)).title).toEqual('NEW TITLE');
  });
  it('Should update an item status, is user of list', async () => {
    mockCheckAuth.userOfListByItemId.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    await updateItem(
      'root',
      { itemId: toUpdate.id, title: 'NEW TITLE', status: true },
      { models: { Item, List, User }, user: { isAdmin: false } },
    );
    expect((await Item.findById(toUpdate.id)).title).toEqual('NEW TITLE');
    expect((await Item.findById(toUpdate.id)).status).toEqual(true);
  });
  it('Should return an error', async () => {
    expect.assertions(1);
    mockCheckAuth.userOfListByItemId.mockImplementationOnce(() => false);
    mockPubsub.publish.mockImplementationOnce(() => false);
    try {
      await updateItem(
        'root',
        { itemId: toUpdate.id, title: 'NEW TITLE' },
        { models: { Item, List, User }, user: { isAdmin: false } },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You do not have permission to update this item.',
      );
    }
  });
});
