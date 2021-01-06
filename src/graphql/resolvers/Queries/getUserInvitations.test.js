import { getUserInvitations } from './getUserInvitations';
import mockGetUserInvitationsLoader from '../../loaders';
import mockBlacklistedToken from '../../../database/models/BlacklistedToken';
import * as mockCheckAuth from '../checkAuth';

jest.mock('../../../database/models/Invitation');
jest.mock('../../../database/models/BlacklistedToken');
jest.mock('../checkAuth');
jest.mock('../../loaders');

describe('getUserInvitations tests', () => {
  it('Confirm load is called once', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    await getUserInvitations(
      {
        id: 'someInviteeId',
      },
      'args',
      {
        loaders: { getUserInvitationsLoader: mockGetUserInvitationsLoader },
        models: { BlacklistedToken: mockBlacklistedToken },
      },
    );
    expect(mockGetUserInvitationsLoader.load).toHaveBeenCalledTimes(1);
  });
});
