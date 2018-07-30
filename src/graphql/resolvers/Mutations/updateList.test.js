import { testDatabase } from '../../../database/testDatabase';
import { updateList } from './updateList';
import { User, List } from '../../../database/models';
import { insertMockUsers, insertMockLists } from '../../../database/mocks';
import * as mockCheckAuth from '../checkAuth';

jest.setTimeout(35000);
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
  toUpdate = await List.findById(lists[0].id);
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('updateList tests', () => {
  it('Should update a list name, isAdmin', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    await updateList(
      'root',
      { listId: toUpdate.id, title: 'NEW TITLE' },
      { models: { List }, user: { isAdmin: true } },
    );
    expect((await List.findById(toUpdate.id)).title).toEqual('NEW TITLE');
  });
  it('Should update a list name, owner of list', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => true);
    await updateList(
      'root',
      { listId: toUpdate.id, title: 'NEW TITLE' },
      { models: { List }, user: { isAdmin: false } },
    );
    expect((await List.findById(toUpdate.id)).title).toEqual('NEW TITLE');
  });
  it('Should return an error', async () => {
    expect.assertions(1);
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
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
