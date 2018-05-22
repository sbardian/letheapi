import { testDatabase } from '../../../database/testDatabase';
import { User, Invitation, List } from '../../../database/models';
import { insertMockLists, insertMockUsers } from '../../../database/mocks';
import { createInvitation } from './createInvitation';
import { returnInvitations } from '../../../database/utils';
import * as mockCheckAuth from '../checkAuth';

jest.setTimeout(10000);
jest.mock('../checkAuth');

let server;
let userToUse;
let listToUse;

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
  await User.findByIdAndUpdate(users[0].id, {
    lists: [lists[0].id],
  });
  [userToUse] = users;
  [listToUse] = lists;
});

afterEach(async () => {
  await User.remove();
  await List.remove();
});

describe('createInvitation test', () => {
  it('Returns error', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    try {
      await createInvitation(
        'root',
        {
          listId: listToUse.id,
          invitee: userToUse.id,
          title: 'InvitationTitle',
        },
        {
          models: { User, List, Invitation },
          user: { id: userToUse.id, isAdmin: false },
        },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You must be the list owner to invite other users.',
      );
    }
  });
  it('Returns created invitation, isAdmin', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    expect(
      returnInvitations(
        await createInvitation(
          'root',
          {
            listId: listToUse.id,
            invitee: userToUse.username,
            title: 'InvitationTitle',
          },
          {
            models: { User, List, Invitation },
            user: { id: userToUse.id, isAdmin: true },
          },
        ),
      ),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'InvitationTitle',
        list: listToUse.id,
        invitee: userToUse.id,
        inviter: userToUse.id,
      }),
    );
  });
  it('Returns created invitation, ownerOfList', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => true);
    expect(
      returnInvitations(
        await createInvitation(
          'root',
          {
            listId: listToUse.id,
            invitee: userToUse.username,
            title: 'InvitationTitle',
          },
          {
            models: { User, List, Invitation },
            user: { id: userToUse.id, isAdmin: false },
          },
        ),
      ),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'InvitationTitle',
        list: listToUse.id,
        invitee: userToUse.id,
        inviter: userToUse.id,
      }),
    );
  });
});
