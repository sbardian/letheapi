import { getUserInvitations } from './';
import mockGetUserInvitationsLoader from '../../loaders';

jest.mock('../../../database/models/Invitation');
jest.mock('../../loaders');

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
