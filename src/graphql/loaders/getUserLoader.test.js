import createDB from '../../database/database';
import { getUserLoader } from './getUserLoader';
import { returnUsers } from '../../database/utils';
import { User, List } from '../../database/models';
import { insertMockUsers } from '../../database/mocks';

let server;
let mockUsers;
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
  mockUsers = await User.insertMany(insertMockUsers(3));
  loaders = { getUserLoader: getUserLoader({ User }) };
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('getUserLoader tests', () => {
  it('Returns users', async () => {
    expect.assertions(3);
    return Promise.all(
      mockUsers.map(async user => {
        const returnedUser = await loaders.getUserLoader.load(user.id);
        expect(returnUsers(returnedUser)).toEqual(returnUsers(user));
      }),
    );
  });
});
