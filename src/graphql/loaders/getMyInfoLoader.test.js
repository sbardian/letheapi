import createDB from '../../database/database';
import { getMyInfoLoader } from './getMyInfoLoader';
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
  mockUsers = await User.insertMany(insertMockUsers(2));
  loaders = { getMyInfoLoader: getMyInfoLoader({ User }) };
});

afterEach(async () => {
  await User.deleteMany();
  await List.deleteMany();
});

describe('getMyInfoLoader tests', () => {
  it('Returns users', async () => {
    expect.assertions(2);
    return Promise.all(
      mockUsers.map(async user => {
        const returnedUser = await loaders.getMyInfoLoader.load(user.id);
        expect(returnUsers(returnedUser)).toEqual(returnUsers(user));
      }),
    );
  });
});
