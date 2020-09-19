import createDB from '../../../database/database';
import { deleteList } from './deleteList';
import { User, List, Item } from '../../../database/models';
import { insertMockLists, insertMockUsers } from '../../../database/mocks';
import * as mockCheckAuth from '../checkAuth';
import { pubsub as mockPubsub } from '../../../server/createApolloServer';

jest.mock('../checkAuth');
jest.mock('../../../server/createApolloServer');

let server;
let toUpdate;

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
  const lists = await List.insertMany(insertMockLists(2, users));
  await User.findByIdAndUpdate(users[0].id, {
    lists: [lists[0].id, lists[1].id],
  });
  toUpdate = await List.findById(lists[0].id);
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('deleteList test', () => {
  it('Returns deleted list, owner', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    await deleteList(
      'root',
      { listId: toUpdate.id },
      {
        models: { User, List, Item },
        user: { id: toUpdate.users[0], isAdmin: false },
      },
    );
    expect(await List.find()).toHaveLength(1);
  });
  it('Returns deleted list, isAdmin', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockPubsub.publish.mockImplementationOnce(() => false);
    await deleteList(
      'root',
      { listId: toUpdate.id },
      {
        models: { User, List, Item },
        user: { id: toUpdate.users[0], isAdmin: true },
      },
    );
    expect(await List.find()).toHaveLength(1);
  });
  it('Returns an error', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockPubsub.publish.mockImplementationOnce(() => false);
    try {
      await deleteList(
        'root',
        { listId: toUpdate.id },
        {
          models: { User, List, Item },
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
