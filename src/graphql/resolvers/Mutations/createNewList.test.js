import { createNewList } from './createNewList';
import createDB from '../../../database/database';
import { User, List } from '../../../database/models';
import * as mockCheckAuth from '../checkAuth';
import { insertMockUsers } from '../../../database/mocks';
import { returnUsers } from '../../../database/utils/utils';
import { pubsub as mockPubsub } from '../../../server/createApolloServer';

jest.mock('../checkAuth');
jest.mock('../../../server/createApolloServer');

let server;
let userToUse;

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
  [userToUse] = users;
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('ceateNewList tests', () => {
  it('Returns an error, not logged in', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    expect.assertions(1);
    try {
      await createNewList(
        'root',
        { ListInfo: { title: 'someListTitle' } },
        { models: { List, User }, pubsub: mockPubsub },
      );
    } catch (err) {
      expect(err.message).toMatch('You must be logged in to create a list.');
    }
  });
  it('Returns an error, no title', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    expect.assertions(1);
    try {
      await createNewList(
        'root',
        { ListInfo: {} },
        {
          models: { List, User },
          user: { id: userToUse.id },
          pubsub: mockPubsub,
        },
      );
    } catch (err) {
      expect(err.message).toMatch('A title is required.');
    }
  });
  it('Returns a list', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    const mockUser = returnUsers(userToUse);
    expect(
      await createNewList(
        'root',
        { ListInfo: { title: 'someListTitle' } },
        {
          models: { List, User },
          user: mockUser,
          pubsub: mockPubsub,
        },
      ),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'someListTitle',
        owner: mockUser,
      }),
    );
  });
});
