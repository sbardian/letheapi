import { getListInvitations } from './getListInvitations';
import mockGetListInvitationsLoader from '../../loaders';
import BlacklistedToken from '../../../database/models/BlacklistedToken';
import * as mockCheckAuth from '../checkAuth';

jest.mock('../../loaders');
jest.mock('../checkAuth');

describe('getListInvitations tests', () => {
  it('Returns an array of invitations', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    await getListInvitations({ id: 'someInvitationId' }, 'args', {
      loaders: { getListInvitationsLoader: mockGetListInvitationsLoader },
      models: { BlacklistedToken },
    });
    expect(mockGetListInvitationsLoader.load).toHaveBeenCalledTimes(1);
  });
});
