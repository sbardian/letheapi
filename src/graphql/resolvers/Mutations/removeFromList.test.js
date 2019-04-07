import { testDatabase } from '../../../database/testDatabase';
import { removeFromList } from './removeFromList';
import { User, List } from '../../../database/models';
import { insertMockLists, insertMockUsers } from '../../../database/mocks';
import * as mockCheckAuth from '../checkAuth';

jest.mock('../checkAuth');

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
  toUpdate = await User.findById(users[0].id);
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('removeFromList tests', () => {
  it('Removes user from list, returns empty list users array, self', async () => {
    await removeFromList(
      'root',
      { listId: toUpdate.lists[0], userId: toUpdate.id },
      {
        models: { User, List },
        user: { id: toUpdate.id, isAdmin: false },
      },
    );
    const updatedList = await List.findById(toUpdate.lists[0]);
    expect(updatedList.users).toHaveLength(0);
  });
  it('Removes user from list, returns empty list users array, admin', async () => {
    await removeFromList(
      'root',
      { listId: toUpdate.lists[0], userId: toUpdate.id },
      {
        models: { User, List },
        user: { id: 'someAdminId', isAdmin: true },
      },
    );
    const updatedList = await List.findById(toUpdate.lists[0]);
    expect(updatedList.users).toHaveLength(0);
  });
  it('Removes user from list, returns empty list users array, owner', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => true);
    await removeFromList(
      'root',
      { listId: toUpdate.lists[0], userId: toUpdate.id },
      {
        models: { User, List },
        user: { id: 'someAdminId', isAdmin: false },
      },
    );
    const updatedList = await List.findById(toUpdate.lists[0]);
    expect(updatedList.users).toHaveLength(0);
  });
  it('Returns an error', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    try {
      await removeFromList(
        'root',
        { listId: toUpdate.lists[0], userId: toUpdate.id },
        {
          models: { User, List },
          user: { id: 'someAdminId', isAdmin: false },
        },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You do not have permission to remove this user from the list.',
      );
    }
  });
});
