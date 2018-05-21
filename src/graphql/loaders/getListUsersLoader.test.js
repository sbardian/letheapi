import { testDatabase } from '../../database/testDatabase';
import { getListUsersLoader } from './';
import { returnUsers } from '../../database/utils';
import { User, List } from '../../database/models';
import { insertMockLists, insertMockUsers } from '../../database/mocks';

jest.setTimeout(10000);

let server;
let mockUsers;
let mockLists;
let loaders;

beforeAll(async done => {
  server = await testDatabase();
  done();
});

afterAll(() => {
  server.mongoose.disconnect();
  server.mongoServer.stop();
});

beforeEach(async () => {
  const user = await User.insertMany(insertMockUsers(1));
  mockLists = await List.insertMany(insertMockLists(1, user));
  await User.findByIdAndUpdate(
    user[0].id,
    {
      lists: [mockLists[0].id],
    },
    { new: true },
  );
  mockUsers = await User.find();
  console.log('mockUsers = ', mockUsers);
  loaders = { getListUsersLoader: getListUsersLoader({ User }) };
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('getLists tests', () => {
  it('DataLoader returns lists users', async () => {
    // expect.assertions(1);
    // expect(
    //   returnUsers(await loaders.getListUsersLoader.load(mockLists[0].id)),
    // ).toEqual(returnUsers(mockUsers));
    console.log('user in test = ', await User.find());
    expect.assertions(1);
    mockLists.forEach(async list => {
      console.log('list.id = ', list.id);
      expect(
        returnUsers(await loaders.getListUsersLoader.load(list.id)),
      ).toEqual(returnUsers(mockUsers));
    });
  });
});
