import { deleteInvitation } from './';
import mockInvitation from '../../../database/models/Invitation';
import mockList from '../../../database/models/List';
import * as mockCheckAuth from '../checkAuth';

jest.mock('../../../database/models/Invitation');
jest.mock('../../../database/models/List');
jest.mock('../checkAuth');

describe('deleteInvitation Tests', () => {
  it('Returns a deleted invitation, is Admin', async () => {
    mockCheckAuth.ownerOfList.mockImplementationOnce(() => false);
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
});