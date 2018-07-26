import { testDatabase } from '../../database/testDatabase';
import { getUserInvitationsLoader } from './getUserInvitationsLoader';
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
let mockInvitations = {};
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
  mockUsers = await User.insertMany(insertMockUsers(9));
  mockLists = await List.insertMany(insertMockLists(2, mockUsers));
  await Promise.all(
    mockUsers.map(async user =>
      User.findByIdAndUpdate(user.id, {
        lists: mockLists.map(list => list.id),
      }),
    ),
  );

  await Promise.all(
    mockUsers.map(async user => {
      const invites = await Invitation.insertMany(
        insertInvitationItems(10, mockLists[0], mockUsers[0], user),
      );
      mockInvitations = {
        ...mockInvitations,
        [user.id]: invites,
      };
    }),
  );

  loaders = {
    getUserInvitationsLoader: getUserInvitationsLoader({ Invitation }),
  };
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('getUserInvitationsLoader tests', () => {
  it('DataLoader returns users invitations', async () => {
    expect.assertions(9);
    return Promise.all(
      mockUsers.map(async user => {
        const invitations = await loaders.getUserInvitationsLoader.load(
          user.id,
        );
        expect(invitations.map(returnInvitations)).toEqual(
          mockInvitations[user.id].map(returnInvitations),
        );
      }),
    );
  });
});
