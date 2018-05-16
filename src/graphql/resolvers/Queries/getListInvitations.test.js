import { getListInvitations } from './';
import mockGetListInvitationsLoader from '../../loaders';

jest.mock('../../loaders');

describe('getListInvitations tests', () => {
  it('Returns an array of invitations', async () => {
    await getListInvitations({ id: 'someInvitationId' }, 'args', {
      loaders: { getListInvitationsLoader: mockGetListInvitationsLoader },
    });
    expect(mockGetListInvitationsLoader.load).toHaveBeenCalledTimes(1);
  });
});
