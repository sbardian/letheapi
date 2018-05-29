import { createNewList } from './createNewList';
import { testDatabase } from '../../../database/testDatabase';
import { User, List } from '../../../database/models';
import { insertMockUsers } from '../../../database/mocks';

jest.setTimeout(10000);
jest.mock('../checkAuth');

let server;
let userToUse;

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
  [userToUse] = users;
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('ceateNewList tests', () => {
  it('Returns an error, not logged in', async () => {
    expect.assertions(1);
    try {
      await createNewList(
        'root',
        { ListInfo: { title: 'someListTitle' } },
        { models: { List, User } },
      );
    } catch (err) {
      expect(err.message).toMatch('You must be logged in to create a list.');
    }
  });
  it('Returns an error, no title', async () => {
    expect.assertions(1);
    try {
      await createNewList(
        'root',
        { ListInfo: {} },
        { models: { List, User }, user: { id: userToUse.id } },
      );
    } catch (err) {
      expect(err.message).toMatch('A title is required.');
    }
  });
  it('Returns a list', async () => {
    expect(
      await createNewList(
        'root',
        { ListInfo: { title: 'someListTitle' } },
        { models: { List, User }, user: { id: userToUse.id } },
      ),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'someListTitle',
        owner: userToUse.id,
      }),
    );
  });
});
