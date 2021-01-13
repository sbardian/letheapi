/* eslint-disable import/no-duplicates */
import { getListInvitationsLoader } from './getListInvitationsLoader';
import mockInvitation from '../../database/models/Invitation';
import Invitation from '../../database/models/Invitation';

jest.mock('../../database/models/Invitation');

describe('getListInvitationsLoader tests', () => {
  it('DataLoader returns users invitations', async () => {
    mockInvitation.find.mockImplementationOnce(() => [
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someInviteeId',
        },
        list: { id: 'someListId' },
      },
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someWrongInviteeId',
        },
        list: { id: 'someListId' },
      },
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someOtherWrongInviteeId',
        },
        list: { id: 'someListId' },
      },
      {
        id: 'someOtherInvitationId',
        title: 'someOtherInvitationTitle',
        inviter: 'someOtherInviterId',
        invitee: {
          id: 'someInviteeId',
        },
        list: { id: 'someOtherListId' },
      },
    ]);
    const loaders = {
      getListInvitationsLoader: getListInvitationsLoader({ Invitation }),
    };
    expect(await loaders.getListInvitationsLoader.load('someListId')).toEqual([
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someInviteeId',
        },
        list: { id: 'someListId' },
      },
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someWrongInviteeId',
        },
        list: { id: 'someListId' },
      },
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: {
          id: 'someOtherWrongInviteeId',
        },
        list: { id: 'someListId' },
      },
    ]);
  });
});
