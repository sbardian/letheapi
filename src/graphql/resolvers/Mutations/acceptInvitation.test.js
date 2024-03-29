import { acceptInvitation } from './acceptInvitation';
import mockInvitation from '../../../database/models/Invitation';
import mockList from '../../../database/models/List';
import mockUser from '../../../database/models/User';
import * as mockCheckAuth from '../checkAuth';
import { pubsub as mockPubsub } from '../../../test-assets/mockPubSub';

jest.mock('../../../database/models/Invitation');
jest.mock('../../../database/models/List');
jest.mock('../../../database/models/User');
jest.mock('../checkAuth');
jest.mock('../../../test-assets/mockPubSub');

describe('acceptInvitation tests', () => {
  it('Returns error', async () => {
    expect.assertions(1);
    mockPubsub.publish.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockInvitation.findById.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: {
        id: 'someInviteeId',
      },
      list: 'someListId',
    }));
    try {
      await acceptInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: {
            Invitation: mockInvitation,
            List: mockList,
            User: mockUser,
          },
          user: { id: 'someWrongInviteeId', isAdmin: false },
        },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You do not have permission to accept this invitation',
      );
    }
  });
  it('Returns accepted invitation, isAdmin', async () => {
    mockPubsub.publish.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockInvitation.findById.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: {
        id: 'someInviteeId',
        lists: [],
      },
      list: 'someListId',
    }));

    mockInvitation.findByIdAndRemove.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: {
        id: 'someInviteeId',
        lists: [],
      },
      list: 'someListId',
    }));

    mockUser.findById.mockImplementationOnce(() => ({
      lists: [],
    }));

    mockList.findById.mockImplementationOnce(() => ({
      users: [],
      id: 'someOtherListId',
    }));

    expect(
      await acceptInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: {
            Invitation: mockInvitation,
            List: mockList,
            User: mockUser,
          },
          user: { id: 'someWrongInviteeId', isAdmin: true },
          pubsub: mockPubsub,
        },
      ),
    ).toEqual({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: {
        id: 'someInviteeId',
        lists: [],
      },
      list: 'someListId',
    });
  });

  it('Returns accepted invitation, is invitee', async () => {
    mockPubsub.publish.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockInvitation.findById.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: 'someInviteeId',
      list: 'someListId',
    }));

    mockInvitation.findByIdAndRemove.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: {
        id: 'someInviteeId',
        lists: [],
      },
      list: 'someListId',
    }));

    mockUser.findById.mockImplementationOnce(() => ({
      lists: [],
    }));

    mockList.findById.mockImplementationOnce(() => ({
      users: [],
      id: 'someOtherListId',
    }));

    expect(
      await acceptInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: {
            Invitation: mockInvitation,
            List: mockList,
            User: mockUser,
          },
          user: { id: 'someInviteeId', isAdmin: false },
          pubsub: mockPubsub,
        },
      ),
    ).toEqual({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: {
        id: 'someInviteeId',
        lists: [],
      },
      list: 'someListId',
    });
  });
});
