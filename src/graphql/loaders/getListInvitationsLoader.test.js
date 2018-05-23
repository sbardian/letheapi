import { testDatabase } from '../../database/testDatabase';
import { getListInvitationsLoader } from './';
import { returnInvitations } from '../../database/utils';
import { User, List, Invitation } from '../../database/models';
import {
  insertMockLists,
  insertMockUsers,
  insertInvitationItems,
} from '../../database/mocks';

jest.setTimeout(20000);

let server;
let mockUsers;
let mockLists;
let mockInvitations = [];
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
  mockUsers = await User.insertMany(insertMockUsers(2));
  mockLists = await List.insertMany(insertMockLists(2, mockUsers));
  Promise.all(
    mockUsers.map(async user =>
      User.findByIdAndUpdate(user.id, {
        lists: mockLists.map(list => list.id),
      }),
    ),
  );
  Promise.all(
    mockLists.map(async list =>
      mockInvitations.push(
        await Invitation.insertMany(
          insertInvitationItems(10, list, mockUsers[0], mockUsers[0]),
        ),
      ),
    ),
  );
  loaders = {
    getListInvitationsLoader: getListInvitationsLoader({ Invitation }),
  };
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('getListInvitationsLoader tests', () => {
  it('DataLoader returns lists users', async () => {
    expect.assertions(2);
    return Promise.all(
      mockLists.map(async (list, index) => {
        const invitations = await loaders.getListInvitationsLoader.load(
          list.id,
        );
        expect(invitations.map(returnInvitations)).toEqual(
          mockInvitations[index].map(returnInvitations),
        );
      }),
    );
  });
});
