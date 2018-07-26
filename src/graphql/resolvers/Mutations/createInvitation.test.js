import { testDatabase } from '../../../database/testDatabase';
import { User, Invitation, List } from '../../../database/models';
import { insertMockLists, insertMockUsers } from '../../../database/mocks';
import { createInvitation } from './createInvitation';
import { returnInvitations } from '../../../database/utils';
import * as mockCheckAuth from '../checkAuth';
import { pubsub as mockPubsub } from '../../../server/server';

jest.setTimeout(25000);
jest.mock('../checkAuth');
jest.mock('../../../server/server');

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
    mockPubsub.publish.mockImplementationOnce(() => false);
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
    mockPubsub.publish.mockImplementationOnce(() => false);
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
            user: {
              id: userToUse.id,
              username: userToUse.username,
              isAdmin: true,
            },
          },
        ),
      ),
    ).toEqual({
      id: expect.any(String),
      title: 'InvitationTitle',
      list: listToUse.id,
      invitee: userToUse.id,
      inviter: expect.objectContaining({
        id: expect.any(String),
        profileImageUrl: null,
        email: expect.any(String),
        username: expect.any(String),
      }),
    });
  });
  it('Returns created invitation, ownerOfList', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
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
            user: {
              id: userToUse.id,
              username: userToUse.username,
              isAdmin: false,
            },
          },
        ),
      ),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'InvitationTitle',
        list: listToUse.id,
        invitee: userToUse.id,
        inviter: expect.objectContaining({
          id: expect.any(String),
          profileImageUrl: null,
          email: expect.any(String),
          username: expect.any(String),
        }),
      }),
    );
  });
});
