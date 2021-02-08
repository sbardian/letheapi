import createDB from '../../database/database';
import { getListInvitationsLoader } from './getListInvitationsLoader';
import { returnInvitations } from '../../database/utils';
import { User, List, Invitation } from '../../database/models';
import {
  insertMockLists,
  insertMockUsers,
  insertInvitationItems,
} from '../../database/mocks';

let server;
let mockUsers;
let mockLists;
let mockInvitations = {};
let loaders;

jest.setTimeout(25000);

beforeAll(async (done) => {
  server = await createDB();
  done();
});

afterAll(() => {
  server.mongoose.disconnect();
  // server.mongoServer.stop();
});

beforeEach(async () => {
  mockUsers = await User.insertMany(insertMockUsers(2));
  mockLists = await List.insertMany(insertMockLists(1, mockUsers));
  await Promise.all(
    mockUsers.map(async (user) =>
      User.findByIdAndUpdate(user.id, {
        lists: mockLists.map((list) => list.id),
      }),
    ),
  );

  await Promise.all(
    mockLists.map(async (list) => {
      const invites = await Invitation.insertMany(
        insertInvitationItems(1, list, mockUsers[0], mockUsers[1]),
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
  await User.deleteMany();
  await List.deleteMany();
  // await Invitation.deleteMany();
});

describe('getListInvitationsLoader tests', () => {
  it('DataLoader returns lists users', async () => {
    expect.assertions(1);
    console.log('Invitations: ', await Invitation.find({}));
    return Promise.all(
      mockLists.map(async (list) => {
        console.log('listId: ', list.id);
        const invitations = await loaders.getListInvitationsLoader.load(
          list.id,
        );
        console.log(
          'query: ',
          await Invitation.find({
            list: list,
          }),
        );
        console.log('invitation from loader: ', invitations);
        expect(JSON.stringify(invitations.map(returnInvitations))).toEqual(
          JSON.stringify(mockInvitations[list.id].map(returnInvitations)),
        );
      }),
    );
  });
});
