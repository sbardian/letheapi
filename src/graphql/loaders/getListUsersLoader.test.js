import createDB from '../../database/database';
import { getListUsersLoader } from './getListUsersLoader';
import { returnUsers } from '../../database/utils';
import { User, List } from '../../database/models';
import { insertMockLists, insertMockUsers } from '../../database/mocks';

let server;
let mockUsers;
let mockLists;
let loaders;

beforeAll(async done => {
  server = await createDB();
  done();
});

afterAll(() => {
  server.mongoose.disconnect();
  // server.mongoServer.stop();
});

beforeEach(async () => {
  mockUsers = await User.insertMany(insertMockUsers(2));
  mockLists = await List.insertMany(insertMockLists(2, mockUsers));
  await Promise.all(
    mockUsers.map(async user =>
      User.findByIdAndUpdate(user.id, {
        lists: mockLists.map(list => list.id),
      }),
    ),
  );
  loaders = { getListUsersLoader: getListUsersLoader({ User }) };
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('getListUsersLoader tests', () => {
  it('DataLoader returns lists users', async () => {
    expect.assertions(2);
    return Promise.all(
      mockLists.map(async list => {
        const users = await loaders.getListUsersLoader.load(list.id);
        expect(users.map(returnUsers)).toEqual(mockUsers.map(returnUsers));
      }),
    );
  });
});
