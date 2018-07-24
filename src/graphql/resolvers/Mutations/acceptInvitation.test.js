import { testDatabase } from '../../../database/testDatabase';
import { User, Invitation, List, Item } from '../../../database/models';
import {
  insertMockLists,
  insertMockUsers,
  insertMockItems,
  insertInvitationItems,
} from '../../../database/mocks';
import { returnInvitations } from '../../../database/utils';
import { acceptInvitation } from './acceptInvitation';

jest.setTimeout(15000);
jest.mock('../checkAuth');

let server;
let invitation;
let userToUse;

beforeAll(async done => {
  server = await testDatabase();
  done();
});

afterAll(() => {
  server.mongoose.disconnect();
  server.mongoServer.stop();
});

beforeEach(async () => {
  const users = await User.insertMany(insertMockUsers(1));
  const lists = await List.insertMany(insertMockLists(1, users));
  await Item.insertMany(insertMockItems(10, lists[0].id, users[0].id));
  await User.findByIdAndUpdate(users[0].id, {
    lists: [lists[0].id],
  });
  invitation = await Invitation.insertMany(
    insertInvitationItems(1, lists[0], users[0], users[0]),
  );
  [userToUse] = users;
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('acceptInvitation tests', () => {
  it('Returns error', async () => {
    try {
      await acceptInvitation(
        'root',
        { invitationId: invitation[0].id },
        {
          models: {
            Invitation,
            User,
            List,
          },
          user: {
            id: 'someUserId',
            isAdmin: false,
          },
        },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You do not have permission to accept this invitation',
      );
    }
  });
  it('Returns invitation, isAdmin', async () => {
    expect(
      await acceptInvitation(
        'root',
        { invitationId: invitation[0].id },
        {
          models: {
            Invitation,
            User,
            List,
          },
          user: {
            id: userToUse.id,
            isAdmin: true,
          },
        },
      ),
    ).toEqual(returnInvitations(invitation[0]));
  });
});
