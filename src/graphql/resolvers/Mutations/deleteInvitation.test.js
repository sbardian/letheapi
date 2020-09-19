import { deleteInvitation } from './deleteInvitation';
import mockInvitation from '../../../database/models/Invitation';
import mockList from '../../../database/models/List';
import * as mockCheckAuth from '../checkAuth';
import { pubsub as mockPubsub } from '../../../server/createApolloServer';

jest.mock('../../../database/models/Invitation');
jest.mock('../../../database/models/List');
jest.mock('../checkAuth');
jest.mock('../../../server/createApolloServer');

describe('deleteInvitation Tests', () => {
  it('Returns a deleted invitation, is Admin', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockPubsub.publish.mockImplementationOnce(() => false);
    mockInvitation.findById.mockImplementationOnce(() => [
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someInviteeId',
        },
        list: 'someListId',
      },
    ]);
    mockInvitation.findByIdAndRemove.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: {
        id: 'someInviteeId',
      },
      list: 'someListId',
    }));
    expect(
      await deleteInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: { Invitation: mockInvitation, List: mockList },
          user: { id: 'someOtherInvitee', isAdmin: true },
        },
      ),
    ).toEqual(
      expect.objectContaining({
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someInviteeId',
        },
        list: 'someListId',
      }),
    );
  });
  it('Returns a deleted invitation, is owner of list', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    mockInvitation.findById.mockImplementationOnce(() => [
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someInviteeId',
        },
        list: 'someListId',
      },
    ]);
    mockInvitation.findByIdAndRemove.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: {
        id: 'someInviteeId',
      },
      list: 'someListId',
    }));
    expect(
      await deleteInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: { Invitation: mockInvitation, List: mockList },
          user: { id: 'someOtherInvitee', isAdmin: false },
        },
      ),
    ).toEqual(
      expect.objectContaining({
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someInviteeId',
        },
        list: 'someListId',
      }),
    );
  });
  it('Returns a deleted invitation, is invitee', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockPubsub.publish.mockImplementationOnce(() => false);
    mockInvitation.findById.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: {
        id: 'someInviteeId',
      },
      list: 'someListId',
    }));
    mockInvitation.findByIdAndRemove.mockImplementationOnce(() => ({
      id: 'someInvitationId',
      title: 'someInvitationTitle',
      inviter: 'someInviterId',
      invitee: {
        id: 'someInviteeId',
      },
      list: 'someListId',
    }));
    expect(
      await deleteInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: { Invitation: mockInvitation, List: mockList },
          user: { id: 'someInviteeId', isAdmin: false },
        },
      ),
    ).toEqual(
      expect.objectContaining({
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someInviteeId',
        },
        list: 'someListId',
      }),
    );
  });
  it('Returns an error', async () => {
    expect.assertions(1);
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
    mockPubsub.publish.mockImplementationOnce(() => false);
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
      await deleteInvitation(
        'root',
        { invitationId: 'someInvitationId' },
        {
          models: { Invitation: mockInvitation, List: mockList },
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
