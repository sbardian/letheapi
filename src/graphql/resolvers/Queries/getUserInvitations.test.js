import { getUserInvitations } from './';
import mockGetUserInvitationsLoader from '../../loaders/getUserInvitationsLoader';

jest.mock('../../../database/models/Invitation');
jest.mock('../../loaders/getUserInvitationsLoader');

describe('getUserInvitations tests', () => {
  it('Confirm load is called once', async () => {
    mockGetUserInvitationsLoader.load.mockImplementationOnce(() => true);
    await getUserInvitations(
      {
        id: 'someInviteeId',
      },
      'args',
      { loaders: { getUserInvitationsLoader: mockGetUserInvitationsLoader } },
    );
    expect(mockGetUserInvitationsLoader.load).toHaveBeenCalledTimes(1);
  });
});
