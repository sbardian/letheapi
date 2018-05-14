import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { testDatabase } from '../../../database/testDatabase';
import { deleteList } from './';
import { User, List } from '../../../database/models';
import { insertMockLists, insertMockUsers } from '../../../database/mocks';
import * as mockCheckAuth from '../checkAuth';

jest.setTimeout(10000);
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
  const lists = await List.insertMany(insertMockLists(2, users[0].id));
  await User.findByIdAndUpdate(users[0].id, {
    lists: [lists[0].id, lists[1].id],
  });
  toUpdate = await List.findById(lists[0].id);
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('deleteList test', () => {
  it('Returns deleted list, owner', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => true);
    await deleteList(
      'root',
      { listId: toUpdate.id },
      {
        models: { User, List },
        user: { id: toUpdate.users[0], isAdmin: false },
      },
    );
    expect(await List.find()).toHaveLength(1);
  });
  it('Returns deleted list, isAdmin', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    await deleteList(
      'root',
      { listId: toUpdate.id },
      {
        models: { User, List },
        user: { id: toUpdate.users[0], isAdmin: true },
      },
    );
    expect(await List.find()).toHaveLength(1);
  });
  it('Returns an error', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    try {
      await deleteList(
        'root',
        { listId: toUpdate.id },
        {
          models: { User, List },
          user: { id: 'someAdminId', isAdmin: false },
        },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You do not have permission to delete this list.',
      );
    }
  });
});