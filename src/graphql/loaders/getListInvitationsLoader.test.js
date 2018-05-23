import { testDatabase } from '../../database/testDatabase';
import { getListInvitationsLoader } from './';
import { returnInvitations } from '../../database/utils';
import { User, List, Invitation } from '../../database/models';
import {
  insertMockLists,
  insertMockUsers,
  insertInvitationItems,
} from '../../database/mocks';

jest.setTimeout(12000);

let server;
let mockUsers;
let mockLists;
let mockInvitations;
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
  // mockLists.map(list =>
  //   Invitation.insertMany(
  //     insertInvitationItems(2, list, mockUsers[0], mockUsers[0]),
  //   ),
  // );

  mockInvitations = await Invitation.insertMany(
    insertInvitationItems(2, mockLists[0], mockUsers[0], mockUsers[0]),
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
    expect.assertions(1);
    // return Promise.all(
    //   mockLists.map(async list => {
    //     const invitations = await loaders.getListInvitationsLoader.load(
    //       list.id,
    //     );
    //     expect(invitations.map(returnInvitations)).toEqual(
    //       mockInvitations.map(returnInvitations),
    //     );
    //   }),
    // );
    expect(
      (await loaders.getListInvitationsLoader.load(mockLists[0].id)).map(
        returnInvitations,
      ),
    ).toEqual(mockInvitations.map(returnInvitations));
  });
});
