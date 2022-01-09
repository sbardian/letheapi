import { declineInvitation } from './declineInvitation';
import mockInvitation from '../../../database/models/Invitation';
import mockList from '../../../database/models/List';
import * as mockDeleteInvitation from './deleteInvitation';
import { pubsub as mockPubsub } from '../../../test-assets/mockPubSub';

jest.mock('../../../database/models/Invitation');
jest.mock('../../../database/models/List');
jest.mock('./deleteInvitation');
jest.mock('../../../test-assets/mockPubSub');

describe('declineInvitation test', () => {
  it('deleteInvitation should be called once', async () => {
    mockInvitation.findById.mockImplementationOnce(() => 'someInvitationId');
    mockList.findById.mockImplementationOnce(() => 'someListId');
    mockDeleteInvitation.deleteInvitation.mockImplementationOnce(() => true);
    mockPubsub.publish.mockImplementationOnce(() => false);
    await declineInvitation(
      'root',
      { invitationId: 'invitationId' },
      {
        models: { Invitation: mockInvitation, List: mockList },
        user: { id: 'someUserId' },
      },
    );
    expect(mockDeleteInvitation.deleteInvitation).toHaveBeenCalledTimes(1);
  });
});
