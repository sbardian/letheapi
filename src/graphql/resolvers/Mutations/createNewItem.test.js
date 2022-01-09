import createDB from '../../../database/database';
import { User, List, Item } from '../../../database/models';
import { insertMockLists, insertMockUsers } from '../../../database/mocks';
import { createNewItem } from './createNewItem';
import { returnItems, returnUsers } from '../../../database/utils';
import * as mockCheckAuth from '../checkAuth';
import { pubsub as mockPubsub } from '../../../test-assets/mockPubSub';

jest.mock('../checkAuth');
jest.mock('../../../test-assets/mockPubSub');

let server;
let userToUse;
let listToUse;

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
  await User.findByIdAndUpdate(users[0].id, {
    lists: [lists[0].id],
  });
  [userToUse] = users;
  [listToUse] = lists;
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('createNewItem tests', () => {
  it('Returns an error', async () => {
    mockCheckAuth.userOfListByListId.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    const mockUser = returnUsers(userToUse);
    expect.assertions(1);
    try {
      await createNewItem(
        'root',
        { ItemInfo: { title: 'newItemTitle', list: listToUse.id } },
        {
          models: { User, List, Item },
          user: { ...mockUser, isAdmin: false },
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
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    const mockUser = returnUsers(userToUse);
    expect(
      returnItems(
        await createNewItem(
          'root',
          { ItemInfo: { title: 'newItemTitle', list: listToUse.id } },
          {
            models: { User, List, Item },
            user: { ...mockUser, isAdmin: true },
            pubsub: mockPubsub,
          },
        ),
      ),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'newItemTitle',
        creator: mockUser.id,
        list: listToUse.id,
      }),
    );
  });
  it('Returns new item, userOfListByListId', async () => {
    mockCheckAuth.userOfListByListId.mockImplementationOnce(() => true);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    const mockUser = returnUsers(userToUse);
    expect(
      returnItems(
        await createNewItem(
          'root',
          { ItemInfo: { title: 'newItemTitle', list: listToUse.id } },
          {
            models: { User, List, Item },
            user: { ...mockUser, isAdmin: false },
            pubsub: mockPubsub,
          },
        ),
      ),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'newItemTitle',
        creator: mockUser.id,
        list: listToUse.id,
      }),
    );
  });
});
