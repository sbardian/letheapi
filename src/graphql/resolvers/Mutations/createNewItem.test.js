import { testDatabase } from '../../../database/testDatabase';
import { User, List, Item } from '../../../database/models';
import { insertMockLists, insertMockUsers } from '../../../database/mocks';
import { createNewItem } from './createNewItem';
import { returnItems } from '../../../database/utils';
import * as mockCheckAuth from '../checkAuth';
import { pubsub as mockPubsub } from '../../../server/server';

jest.setTimeout(10000);
jest.mock('../checkAuth');
jest.mock('../../../server/server');

let server;
let userToUse;
let listToUse;

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
  const lists = await List.insertMany(insertMockLists(1, users));
  await User.findByIdAndUpdate(users[0].id, {
    lists: [lists[0].id],
  });
  [userToUse] = users;
  [listToUse] = lists;
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('createNewItem tests', () => {
  it('Returns an error', async () => {
    mockCheckAuth.userOfListByListId.mockImplementationOnce(() => false);
    mockPubsub.publish.mockImplementationOnce(() => false);
    expect.assertions(1);
    try {
      await createNewItem(
        'root',
        { ItemInfo: { title: 'newItemTitle', list: listToUse.id } },
        {
          models: { User, List, Item },
          user: { id: userToUse.id, isAdmin: false },
        },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You do not have permission to create items in this list.',
      );
    }
  });
  it('Returns new item, isAdmin', async () => {
    mockCheckAuth.userOfListByListId.mockImplementationOnce(() => false);
    mockPubsub.publish.mockImplementationOnce(() => false);
    expect(
      returnItems(
        await createNewItem(
          'root',
          { ItemInfo: { title: 'newItemTitle', list: listToUse.id } },
          {
            models: { User, List, Item },
            user: { id: userToUse.id, isAdmin: true },
          },
        ),
      ),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'newItemTitle',
        creator: userToUse.id,
        list: listToUse.id,
      }),
    );
  });
  it('Returns new item, userOfListByListId', async () => {
    mockCheckAuth.userOfListByListId.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    expect(
      returnItems(
        await createNewItem(
          'root',
          { ItemInfo: { title: 'newItemTitle', list: listToUse.id } },
          {
            models: { User, List, Item },
            user: { id: userToUse.id, isAdmin: false },
          },
        ),
      ),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'newItemTitle',
        creator: userToUse.id,
        list: listToUse.id,
      }),
    );
  });
});
