import { testDatabase } from '../../database/testDatabase';
import { getListInvitationsLoader } from './getListInvitationsLoader';
import { returnInvitations } from '../../database/utils';
import { User, List, Invitation } from '../../database/models';
import {
  insertMockLists,
  insertMockUsers,
  insertInvitationItems,
} from '../../database/mocks';

jest.setTimeout(35000);

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
  mockUsers = await User.insertMany(insertMockUsers(2));
  mockLists = await List.insertMany(insertMockLists(9, mockUsers));
  await Promise.all(
    mockUsers.map(async user =>
      User.findByIdAndUpdate(user.id, {
        lists: mockLists.map(list => list.id),
      }),
    ),
  );

  await Promise.all(
    mockLists.map(async list => {
      const invites = await Invitation.insertMany(
        insertInvitationItems(2, list, mockUsers[0], mockUsers[0]),
      );
      mockInvitations = {
        ...mockInvitations,
        [list.id]: invites,
      };
    }),
  );

  // Alternate code for populating mockInvitations, cause weirdness
  // mockInvitations = await mockLists.reduce(async (m, list) => {
  //   return {
  //     ...(await m),
  //     [list.id]: await Invitation.insertMany(
  //       insertInvitationItems(20, list, mockUsers[0], mockUsers[0]),
  //     ),
  //   };
  // }, Promise.resolve({}));

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
    expect.assertions(9);
    return Promise.all(
      mockLists.map(async list => {
        const invitations = await loaders.getListInvitationsLoader.load(
          list.id,
        );
        expect(invitations.map(returnInvitations)).toEqual(
          mockInvitations[list.id].map(returnInvitations),
        );
      }),
    );
  });
});
