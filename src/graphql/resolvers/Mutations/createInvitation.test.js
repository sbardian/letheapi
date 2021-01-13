import createDB from '../../../database/database';
import { User, Invitation, List } from '../../../database/models';
import { insertMockLists, insertMockUsers } from '../../../database/mocks';
import { createInvitation } from './createInvitation';
import { returnInvitations, returnLists } from '../../../database/utils';
import * as mockCheckAuth from '../checkAuth';
import { pubsub as mockPubsub } from '../../../server/createApolloServer';

jest.mock('../checkAuth');
jest.mock('../../../server/createApolloServer');

let server;
let userToUse;
let listToUse;

beforeAll(async (done) => {
  server = await createDB();
  done();
});

afterAll(() => {
  server.mongoose.disconnect();
  // server.mongoServer.stop();
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
  await User.deleteMany();
  await List.deleteMany();
});

describe('createInvitation test', () => {
  it('Returns error', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
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
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    const mockList = returnLists(listToUse);
    expect(
      returnInvitations(
        await createInvitation(
          'root',
          {
            listId: mockList.id,
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
            pubsub: mockPubsub,
          },
        ),
      ),
    ).toEqual({
      id: expect.any(String),
      title: 'InvitationTitle',
      list: mockList,
      invitee: expect.objectContaining({
        id: expect.any(String),
        profileImageUrl: null,
        email: expect.any(String),
        username: expect.any(String),
      }),
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
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    const mockList = returnLists(listToUse);
    expect(
      returnInvitations(
        await createInvitation(
          'root',
          {
            listId: mockList.id,
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
            pubsub: mockPubsub,
          },
        ),
      ),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'InvitationTitle',
        list: mockList,
        invitee: expect.objectContaining({
          id: expect.any(String),
          profileImageUrl: null,
          email: expect.any(String),
          username: expect.any(String),
        }),
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
