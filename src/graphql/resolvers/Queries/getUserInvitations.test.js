import { getUserInvitations } from './';
import mockInvitation from '../../../database/models/Invitation';

jest.mock('../../../database/models/Invitation');

describe('getUserInvitations tests', () => {
  it('Returns an array of invitations', async () => {
    mockInvitation.find.mockImplementationOnce(() => [
      {
        id: 'someInvitationId',
        title: 'someInvitationTitle',
        inviter: 'someInviterId',
        invitee: 'someInviteeId',
        list: 'someListId',
      },
    ]);
    expect(
      await getUserInvitations(
        {
          id: 'someInviteeId',
        },
        'args',
        { models: { Invitation: mockInvitation } },
      ),
    ).toEqual(
      expect.arrayContaining([
        {
          id: 'someInvitationId',
          title: 'someInvitationTitle',
          inviter: 'someInviterId',
          invitee: 'someInviteeId',
          list: 'someListId',
        },
      ]),
    );
  });
});
