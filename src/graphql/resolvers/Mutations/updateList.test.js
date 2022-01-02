import createDB from '../../../database/database';
import { updateList } from './updateList';
import { User, List } from '../../../database/models';
import { insertMockUsers, insertMockLists } from '../../../database/mocks';
import * as mockCheckAuth from '../checkAuth';
import { pubsub as mockPubsub } from '../../../server/createApolloServers';

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

describe('updateList tests', () => {
  it('Should update a list name, isAdmin', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    await updateList(
      'root',
      { listId: toUpdate.id, title: 'NEW TITLE' },
      { models: { List }, user: { isAdmin: true }, pubsub: mockPubsub },
    );
    expect((await List.findById(toUpdate.id)).title).toEqual('NEW TITLE');
  });
  it('Should update a list name, owner of list', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => true);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    await updateList(
      'root',
      { listId: toUpdate.id, title: 'NEW TITLE' },
      { models: { List }, user: { isAdmin: false }, pubsub: mockPubsub },
    );
    expect((await List.findById(toUpdate.id)).title).toEqual('NEW TITLE');
  });
  it('Should return an error', async () => {
    expect.assertions(1);
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    try {
      await updateList(
        'root',
        { listId: toUpdate.id, title: 'NEW TITLE' },
        { models: { List }, user: { isAdmin: false } },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You do not have permission to update this list.',
      );
    }
  });
});
