import { deleteInvitation } from './deleteInvitation';
import mockInvitation from '../../../database/models/Invitation';
import mockList from '../../../database/models/List';
import * as mockCheckAuth from '../checkAuth';
import { pubsub as mockPubsub } from '../../../server/createApolloServers';

jest.mock('../../../database/models/Invitation');
jest.mock('../../../database/models/List');
jest.mock('../checkAuth');
jest.mock('../../../server/createApolloServers');

describe('deleteInvitation Tests', () => {
  it('Returns a deleted invitation, is Admin', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockInvitation.findById.mockImplementationOnce(() => [
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: 'someInviteeId',
        list: 'someListId',
      },
    ]);
    mockInvitation.findByIdAndRemove.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: 'someInviteeId',
      list: 'someListId',
    }));
    expect(
      await deleteInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: { Invitation: mockInvitation, List: mockList },
          pubsub: mockPubsub,
          user: { id: 'someOtherInvitee', isAdmin: true },
        },
      ),
    ).toEqual(
      expect.objectContaining({
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: 'someInviteeId',
        list: 'someListId',
      }),
    );
  });
  it('Returns a deleted invitation, is owner of list', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => true);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    mockInvitation.findById.mockImplementationOnce(() => [
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: 'someInviteeId',
        list: 'someListId',
      },
    ]);
    mockInvitation.findByIdAndRemove.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: 'someInviteeId',
      list: 'someListId',
    }));
    expect(
      await deleteInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: { Invitation: mockInvitation, List: mockList },
          pubsub: mockPubsub,
          user: { id: 'someOtherInvitee', isAdmin: false },
        },
      ),
    ).toEqual(
      expect.objectContaining({
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: 'someInviteeId',
        list: 'someListId',
      }),
    );
  });
  it('Returns a deleted invitation, is invitee', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
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
      invitee: 'someInviteeId',
      list: 'someListId',
    }));
    expect(
      await deleteInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: { Invitation: mockInvitation, List: mockList },
          pubsub: mockPubsub,
          user: { id: 'someInviteeId', isAdmin: false },
        },
      ),
    ).toEqual(
      expect.objectContaining({
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: 'someInviteeId',
        list: 'someListId',
      }),
    );
  });
  it('Returns an error', async () => {
    expect.assertions(1);
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    mockInvitation.findById.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: 'someInviteeId',
      list: 'someListId',
    }));
    try {
      await deleteInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: { Invitation: mockInvitation, List: mockList },
          pubsub: mockPubsub,
          user: { id: 'someWrongInviteeId', isAdmin: false },
        },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You do not have permission to delete this invitation.',
      );
    }
  });
});
