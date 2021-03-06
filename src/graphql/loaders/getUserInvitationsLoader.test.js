/* eslint-disable import/no-duplicates */
import { getUserInvitationsLoader } from './getUserInvitationsLoader';
import mockInvitation from '../../database/models/Invitation';
import Invitation from '../../database/models/Invitation';

jest.mock('../../database/models/Invitation');

describe('getUserInvitationsLoader tests', () => {
  it('DataLoader returns users invitations', async () => {
    mockInvitation.find.mockImplementationOnce(() => [
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: 'someInviteeId',
        list: 'someListId',
      },
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: 'someWrongInviteeId',
        list: 'someListId',
      },
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: 'someOtherWrongInviteeId',
        list: 'someListId',
      },
      {
        id: 'someOtherInvitationId',
        title: 'someOtherInvitationTitle',
        inviter: 'someOtherInviterId',
        invitee: 'someInviteeId',
        list: 'someOtherListId',
      },
    ]);
    const loaders = {
      getUserInvitationsLoader: getUserInvitationsLoader({ Invitation }),
    };
    expect(
      await loaders.getUserInvitationsLoader.load('someInviteeId'),
    ).toEqual([
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: 'someInviteeId',
        list: 'someListId',
      },
      {
        id: 'someOtherInvitationId',
        title: 'someOtherInvitationTitle',
        inviter: 'someOtherInviterId',
        invitee: 'someInviteeId',
        list: 'someOtherListId',
      },
    ]);
  });
});
